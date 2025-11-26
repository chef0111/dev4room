import "server-only";

import { db } from "@/database/drizzle";
import { question, tag, tagQuestion, user } from "@/database/schema";
import {
  QuestionListDTO,
  QuestionListSchema,
  QuestionQueryParams,
  CreateQuestionInput,
  QuestionDetailDTO,
} from "./question.dto";
import { and, or, ilike, desc, asc, sql, eq, inArray, SQL } from "drizzle-orm";

/**
 * Get paginated list of questions with author and tags
 */
export async function getQuestions(
  params: QuestionQueryParams,
): Promise<{ questions: QuestionListDTO[]; totalQuestions: number }> {
  const { page = 1, pageSize = 10, query, filter } = params;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Build where conditions
  const conditions: (SQL<unknown> | undefined)[] = [];

  if (query) {
    conditions.push(
      or(
        ilike(question.title, `%${query}%`),
        ilike(question.content, `%${query}%`),
      ),
    );
  }

  // Filter for unanswered questions
  if (filter === "unanswered") {
    conditions.push(eq(question.answers, 0));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Determine sort criteria
  let sortCriteria;
  switch (filter) {
    case "newest":
      sortCriteria = desc(question.createdAt);
      break;
    case "oldest":
      sortCriteria = asc(question.createdAt);
      break;
    case "popular":
      sortCriteria = desc(question.upvotes);
      break;
    case "unanswered":
      sortCriteria = desc(question.createdAt);
      break;
    default:
      sortCriteria = desc(question.createdAt);
  }

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(question)
    .where(where);

  const totalQuestions = countResult?.count ?? 0;

  // Get paginated questions with author
  const questionsWithAuthors = await db
    .select({
      id: question.id,
      title: question.title,
      content: question.content,
      views: question.views,
      upvotes: question.upvotes,
      downvotes: question.downvotes,
      answers: question.answers,
      createdAt: question.createdAt,
      authorId: question.authorId,
      authorName: user.name,
      authorImage: user.image,
    })
    .from(question)
    .leftJoin(user, eq(question.authorId, user.id))
    .where(where)
    .orderBy(sortCriteria)
    .limit(limit)
    .offset(offset);

  // Get tags for each question
  const questionIds = questionsWithAuthors.map((q) => q.id);

  const tagsForQuestions =
    questionIds.length > 0
      ? await db
          .select({
            questionId: tagQuestion.questionId,
            tagId: tag.id,
            tagName: tag.name,
          })
          .from(tagQuestion)
          .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
          .where(inArray(tagQuestion.questionId, questionIds))
      : [];

  // Group tags by question ID
  const tagsByQuestionId = tagsForQuestions.reduce(
    (acc, t) => {
      if (!acc[t.questionId]) {
        acc[t.questionId] = [];
      }
      acc[t.questionId].push({ id: t.tagId, name: t.tagName });
      return acc;
    },
    {} as Record<string, { id: string; name: string }[]>,
  );

  // Build final questions array
  const questions = questionsWithAuthors.map((q) => ({
    id: q.id,
    title: q.title,
    content: q.content,
    views: q.views,
    upvotes: q.upvotes,
    downvotes: q.downvotes,
    answers: q.answers,
    createdAt: q.createdAt,
    author: {
      id: q.authorId,
      name: q.authorName ?? "Unknown",
      image: q.authorImage,
    },
    tags: tagsByQuestionId[q.id] || [],
  }));

  // Validate and return questions
  const validatedQuestions = questions
    .map((q) => {
      const result = QuestionListSchema.safeParse(q);
      if (!result.success) {
        console.error("Question validation failed:", result.error);
        return null;
      }
      return result.data;
    })
    .filter((q): q is QuestionListDTO => q !== null);

  return { questions: validatedQuestions, totalQuestions };
}

/**
 * Create a new question with tags
 */
export async function createQuestion(
  input: CreateQuestionInput,
  authorId: string,
): Promise<QuestionDetailDTO> {
  const { title, content, tags: tagNames } = input;

  return await db.transaction(async (tx) => {
    const [newQuestion] = await tx
      .insert(question)
      .values({
        title,
        content,
        authorId,
      })
      .returning();

    // Process tags - find or create each tag
    const tagIds: string[] = [];

    for (const tagName of tagNames) {
      const normalizedName = tagName.toLowerCase().trim();

      // Try to find existing tag
      const [existingTag] = await tx
        .select({ id: tag.id })
        .from(tag)
        .where(ilike(tag.name, normalizedName))
        .limit(1);

      if (existingTag) {
        // Increment question count for existing tag
        await tx
          .update(tag)
          .set({ questions: sql`${tag.questions} + 1` })
          .where(eq(tag.id, existingTag.id));

        tagIds.push(existingTag.id);
      } else {
        // Create new tag and get its ID
        const [newTag] = await tx
          .insert(tag)
          .values({
            name: normalizedName,
            questions: 1,
          })
          .returning({ id: tag.id });

        tagIds.push(newTag.id);
      }
    }

    // Create tag-question relationships
    if (tagIds.length > 0) {
      await tx.insert(tagQuestion).values(
        tagIds.map((tagId) => ({
          questionId: newQuestion.id,
          tagId,
        })),
      );
    }

    // Get the author data
    const [author] = await tx
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, authorId))
      .limit(1);

    // Get created tags
    const createdTags =
      tagIds.length > 0
        ? await tx
            .select({ id: tag.id, name: tag.name })
            .from(tag)
            .where(inArray(tag.id, tagIds))
        : [];

    return {
      id: newQuestion.id,
      title: newQuestion.title,
      content: newQuestion.content,
      views: newQuestion.views,
      upvotes: newQuestion.upvotes,
      downvotes: newQuestion.downvotes,
      answers: newQuestion.answers,
      createdAt: newQuestion.createdAt,
      updatedAt: newQuestion.updatedAt,
      author: {
        id: author?.id ?? authorId,
        name: author?.name ?? "Unknown",
        image: author?.image ?? null,
      },
      tags: createdTags,
    };
  });
}

/**
 * Increment view count for a question
 */
export async function incrementQuestionViews(
  questionId: string,
): Promise<{ views: number }> {
  const [updated] = await db
    .update(question)
    .set({ views: sql`${question.views} + 1` })
    .where(eq(question.id, questionId))
    .returning({ views: question.views });

  if (!updated) {
    throw new Error("Question not found");
  }

  return { views: updated.views };
}
