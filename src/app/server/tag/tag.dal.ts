import "server-only";

import { db } from "@/database/drizzle";
import { tag, tagQuestion, question, user } from "@/database/schema";
import { and, or, ilike, desc, asc, sql, eq, inArray } from "drizzle-orm";
import { getPagination, validateArray, validateOne } from "../utils";
import { TagQuestionService } from "../tag-question/service";
import {
  TagsDTO,
  TagsSchema,
  TagQueryParams,
  TagQuestionsQueryParams,
  TagQuestionsOutput,
  TagDetailSchema,
} from "./tag.dto";
import { QuestionListSchema } from "../question/question.dto";

type TagFilter = "popular" | "recent" | "oldest" | "alphabetical";
type QuestionFilter = "newest" | "oldest" | "popular";

interface QuestionRow {
  id: string;
  title: string;
  content: string;
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  createdAt: Date;
  authorId: string;
  authorName: string | null;
  authorImage: string | null;
}

export class TagDAL {
  private static readonly tagSelectFields = {
    id: tag.id,
    name: tag.name,
    questions: tag.questions,
    createdAt: tag.createdAt,
  } as const;

  private static readonly questionSelectFields = {
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
  } as const;

  private static getTagSortCriteria(filter?: TagFilter) {
    switch (filter) {
      case "recent":
        return desc(tag.createdAt);
      case "oldest":
        return asc(tag.createdAt);
      case "alphabetical":
        return asc(tag.name);
      case "popular":
      default:
        return desc(tag.questions);
    }
  }

  private static getQuestionSortCriteria(filter?: QuestionFilter) {
    switch (filter) {
      case "oldest":
        return asc(question.createdAt);
      case "popular":
        return desc(question.upvotes);
      case "newest":
      default:
        return desc(question.createdAt);
    }
  }

  private static buildTagSearchCondition(query?: string) {
    if (!query) return undefined;
    return ilike(tag.name, `%${query}%`);
  }

  private static buildQuestionSearchCondition(query?: string) {
    if (!query) return undefined;
    return or(
      ilike(question.title, `%${query}%`),
      ilike(question.content, `%${query}%`),
    );
  }

  private static mapQuestionToDTO(
    row: QuestionRow,
    tags: { id: string; name: string }[],
  ) {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      views: row.views,
      upvotes: row.upvotes,
      downvotes: row.downvotes,
      answers: row.answers,
      createdAt: row.createdAt,
      author: {
        id: row.authorId,
        name: row.authorName ?? "Unknown",
        image: row.authorImage,
      },
      tags,
    };
  }

  static async findMany(
    params: TagQueryParams,
  ): Promise<{ tags: TagsDTO[]; totalTags: number }> {
    const { query, filter } = params;
    const { offset, limit } = getPagination(params, { page: 1, pageSize: 12 });

    // Build where conditions
    const conditions = [this.buildTagSearchCondition(query)].filter(Boolean);
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const sortCriteria = this.getTagSortCriteria(filter as TagFilter);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tag)
      .where(where);

    const rows = await db
      .select(this.tagSelectFields)
      .from(tag)
      .where(where)
      .orderBy(sortCriteria)
      .limit(limit)
      .offset(offset);

    const tags = validateArray(rows, TagsSchema, "Tag");

    return { tags, totalTags: count ?? 0 };
  }

  static async findWithQuestions(
    params: TagQuestionsQueryParams,
  ): Promise<TagQuestionsOutput> {
    const { tagId, query, filter } = params;
    const { offset, limit } = getPagination(params);

    const [tagRow] = await db
      .select({ ...this.tagSelectFields, updatedAt: tag.updatedAt })
      .from(tag)
      .where(eq(tag.id, tagId))
      .limit(1);

    if (!tagRow) {
      throw new Error("Tag not found");
    }

    const validatedTag = validateOne(tagRow, TagDetailSchema, "Tag");

    // Build where conditions
    const questionIdsWithTag = db
      .select({ questionId: tagQuestion.questionId })
      .from(tagQuestion)
      .where(eq(tagQuestion.tagId, tagId));

    const conditions = [
      inArray(question.id, questionIdsWithTag),
      this.buildQuestionSearchCondition(query),
    ].filter(Boolean);

    const where = and(...conditions);
    const sortCriteria = this.getQuestionSortCriteria(filter as QuestionFilter);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(question)
      .where(where);

    // Fetch questions with author
    const rows = await db
      .select(this.questionSelectFields)
      .from(question)
      .leftJoin(user, eq(question.authorId, user.id))
      .where(where)
      .orderBy(sortCriteria)
      .limit(limit)
      .offset(offset);

    // Fetch tags for all questions
    const tagsByQuestion = await TagQuestionService.getTagsQuestions(
      rows.map((r) => r.id),
    );

    const questions = validateArray(
      rows.map((row) =>
        this.mapQuestionToDTO(row, tagsByQuestion[row.id] ?? []),
      ),
      QuestionListSchema,
      "Question",
    );

    return {
      tag: validatedTag,
      questions,
      totalQuestions: count ?? 0,
    };
  }

  static async findPopular(limit: number = 5): Promise<TagsDTO[]> {
    const rows = await db
      .select(this.tagSelectFields)
      .from(tag)
      .orderBy(desc(tag.questions))
      .limit(limit);

    return validateArray(rows, TagsSchema, "Tag");
  }
}

export const getTags = TagDAL.findMany.bind(TagDAL);
export const getTagWithQuestions = TagDAL.findWithQuestions.bind(TagDAL);
export const getPopularTags = TagDAL.findPopular.bind(TagDAL);
