import "server-only";

import { db } from "@/database/drizzle";
import { question, tag, tagQuestion, user } from "@/database/schema";
import {
  QuestionListDTO,
  QuestionListSchema,
  QuestionQueryParams,
  CreateQuestionInput,
  EditQuestionInput,
  EditQuestionOutput,
  GetQuestionOutput,
  QuestionDetailSchema,
} from "./question.dto";
import {
  and,
  or,
  ilike,
  desc,
  asc,
  sql,
  eq,
  inArray,
  SQL,
  ne,
} from "drizzle-orm";

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

export async function createQuestion(
  input: CreateQuestionInput,
  authorId: string,
): Promise<{ id: string }> {
  const { title, content, tags: tagNames } = input;

  return await db.transaction(async (tx) => {
    // Create the question first
    const [newQuestion] = await tx
      .insert(question)
      .values({
        title,
        content,
        authorId,
      })
      .returning({ id: question.id });

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

    return { id: newQuestion.id };
  });
}

export async function getQuestionById(
  questionId: string,
): Promise<GetQuestionOutput> {
  // Get question with author
  const [questionWithAuthor] = await db
    .select({
      id: question.id,
      title: question.title,
      content: question.content,
      views: question.views,
      upvotes: question.upvotes,
      downvotes: question.downvotes,
      answers: question.answers,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      authorId: question.authorId,
      authorName: user.name,
      authorImage: user.image,
    })
    .from(question)
    .leftJoin(user, eq(question.authorId, user.id))
    .where(eq(question.id, questionId))
    .limit(1);

  if (!questionWithAuthor) {
    throw new Error("Question not found");
  }

  // Get tags for this question
  const tagsResult = await db
    .select({
      id: tag.id,
      name: tag.name,
    })
    .from(tagQuestion)
    .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
    .where(eq(tagQuestion.questionId, questionId));

  const questionData = {
    id: questionWithAuthor.id,
    title: questionWithAuthor.title,
    content: questionWithAuthor.content,
    views: questionWithAuthor.views,
    upvotes: questionWithAuthor.upvotes,
    downvotes: questionWithAuthor.downvotes,
    answers: questionWithAuthor.answers,
    createdAt: questionWithAuthor.createdAt,
    updatedAt: questionWithAuthor.updatedAt,
    author: {
      id: questionWithAuthor.authorId,
      name: questionWithAuthor.authorName ?? "Unknown",
      image: questionWithAuthor.authorImage,
    },
    tags: tagsResult,
  };

  // Validate the result
  const validated = QuestionDetailSchema.safeParse(questionData);
  if (!validated.success) {
    console.error("Question validation failed:", validated.error);
    throw new Error("Failed to validate question data");
  }

  return validated.data;
}

export async function editQuestion(
  input: EditQuestionInput,
  userId: string,
): Promise<EditQuestionOutput> {
  const { questionId, title, content, tags: tagNames } = input;

  return await db.transaction(async (tx) => {
    // Fetch the question and verify ownership
    const [existingQuestion] = await tx
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
        authorId: question.authorId,
      })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!existingQuestion) {
      throw new Error("Question not found");
    }

    if (existingQuestion.authorId !== userId) {
      throw new Error("Unauthorized to edit this question");
    }

    // Update title and content if changed
    if (
      existingQuestion.title !== title ||
      existingQuestion.content !== content
    ) {
      await tx
        .update(question)
        .set({ title, content })
        .where(eq(question.id, questionId));
    }

    // Get current tags for this question
    const currentTagsResult = await tx
      .select({
        tagId: tag.id,
        tagName: tag.name,
      })
      .from(tagQuestion)
      .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
      .where(eq(tagQuestion.questionId, questionId));

    const currentTags = currentTagsResult.map((t) => ({
      id: t.tagId,
      name: t.tagName.toLowerCase(),
    }));

    const normalizedNewTags = tagNames.map((t) => t.toLowerCase().trim());

    // Determine tags to add (in new tags but not in current)
    const tagsToAdd = normalizedNewTags.filter(
      (newTag) => !currentTags.some((t) => t.name === newTag),
    );

    // Determine tags to remove (in current but not in new)
    const tagsToRemove = currentTags.filter(
      (current) => !normalizedNewTags.includes(current.name),
    );

    // Add new tags
    const newTagIds: string[] = [];
    for (const tagName of tagsToAdd) {
      // Try to find existing tag
      const [existingTag] = await tx
        .select({ id: tag.id })
        .from(tag)
        .where(ilike(tag.name, tagName))
        .limit(1);

      if (existingTag) {
        // Increment question count for existing tag
        await tx
          .update(tag)
          .set({ questions: sql`${tag.questions} + 1` })
          .where(eq(tag.id, existingTag.id));

        newTagIds.push(existingTag.id);
      } else {
        // Create new tag
        const [newTag] = await tx
          .insert(tag)
          .values({
            name: tagName,
            questions: 1,
          })
          .returning({ id: tag.id });

        newTagIds.push(newTag.id);
      }
    }

    // Create tag-question relationships for new tags
    if (newTagIds.length > 0) {
      await tx.insert(tagQuestion).values(
        newTagIds.map((tagId) => ({
          questionId,
          tagId,
        })),
      );
    }

    // Remove old tags
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((t) => t.id);

      // Decrement question count for tags being removed
      await tx
        .update(tag)
        .set({ questions: sql`${tag.questions} - 1` })
        .where(inArray(tag.id, tagIdsToRemove));

      // Remove tag-question relationships
      await tx
        .delete(tagQuestion)
        .where(
          and(
            eq(tagQuestion.questionId, questionId),
            inArray(tagQuestion.tagId, tagIdsToRemove),
          ),
        );
    }

    // Fetch updated tags for response
    const updatedTags = await tx
      .select({
        id: tag.id,
        name: tag.name,
      })
      .from(tagQuestion)
      .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
      .where(eq(tagQuestion.questionId, questionId));

    return {
      id: questionId,
      title,
      content,
      tags: updatedTags,
    };
  });
}

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
