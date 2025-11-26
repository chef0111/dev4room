import "server-only";

import { db } from "@/database/drizzle";
import { tag, tagQuestion, question, user } from "@/database/schema";
import {
  TagListDTO,
  TagListSchema,
  TagQueryParams,
  TagQuestionsQueryParams,
  TagDetailDTO,
} from "./tag.dto";
import { QuestionListDTO, QuestionListSchema } from "../question/question.dto";
import { and, or, ilike, desc, asc, sql, eq, inArray, SQL } from "drizzle-orm";

export async function getTags(
  params: TagQueryParams,
): Promise<{ tags: TagListDTO[]; totalTags: number }> {
  const { page = 1, pageSize = 12, query, filter } = params;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Build where conditions
  const conditions: (SQL<unknown> | undefined)[] = [];

  if (query) {
    conditions.push(ilike(tag.name, `%${query}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Determine sort criteria
  let sortCriteria;
  switch (filter) {
    case "popular":
      sortCriteria = desc(tag.questions);
      break;
    case "recent":
      sortCriteria = desc(tag.createdAt);
      break;
    case "oldest":
      sortCriteria = asc(tag.createdAt);
      break;
    case "alphabetical":
      sortCriteria = asc(tag.name);
      break;
    default:
      sortCriteria = desc(tag.questions);
  }

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(tag)
    .where(where);

  const totalTags = countResult?.count ?? 0;

  // Get paginated tags
  const results = await db
    .select({
      id: tag.id,
      name: tag.name,
      questions: tag.questions,
      createdAt: tag.createdAt,
    })
    .from(tag)
    .where(where)
    .orderBy(sortCriteria)
    .limit(limit)
    .offset(offset);

  // Validate and return tags
  const validatedTags = results
    .map((t) => {
      const result = TagListSchema.safeParse(t);
      if (!result.success) {
        console.error("Tag validation failed:", result.error);
        return null;
      }
      return result.data;
    })
    .filter((t): t is TagListDTO => t !== null);

  return { tags: validatedTags, totalTags };
}

/**
 * Get a tag with its associated questions
 */
export async function getTagWithQuestions(
  params: TagQuestionsQueryParams,
): Promise<{
  tag: TagDetailDTO;
  questions: QuestionListDTO[];
  totalQuestions: number;
}> {
  const { tagId, page = 1, pageSize = 10, query, filter } = params;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Get the tag
  const [tagResult] = await db
    .select({
      id: tag.id,
      name: tag.name,
      questions: tag.questions,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    })
    .from(tag)
    .where(eq(tag.id, tagId))
    .limit(1);

  if (!tagResult) {
    throw new Error("Tag not found");
  }

  // Build where conditions for questions
  const conditions: (SQL<unknown> | undefined)[] = [];

  // Get question IDs that have this tag
  const questionIdsWithTag = db
    .select({ questionId: tagQuestion.questionId })
    .from(tagQuestion)
    .where(eq(tagQuestion.tagId, tagId));

  conditions.push(inArray(question.id, questionIdsWithTag));

  if (query) {
    conditions.push(
      or(
        ilike(question.title, `%${query}%`),
        ilike(question.content, `%${query}%`),
      ),
    );
  }

  const where = and(...conditions);

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

  // Get all tags for these questions
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

  // Validate questions
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

  return {
    tag: tagResult,
    questions: validatedQuestions,
    totalQuestions,
  };
}

/**
 * Get popular tags (for sidebar/widgets)
 */
export async function getPopularTags(limit: number = 5): Promise<TagListDTO[]> {
  const results = await db
    .select({
      id: tag.id,
      name: tag.name,
      questions: tag.questions,
      createdAt: tag.createdAt,
    })
    .from(tag)
    .orderBy(desc(tag.questions))
    .limit(limit);

  return results
    .map((t) => {
      const result = TagListSchema.safeParse(t);
      if (!result.success) {
        console.error("Tag validation failed:", result.error);
        return null;
      }
      return result.data;
    })
    .filter((t): t is TagListDTO => t !== null);
}
