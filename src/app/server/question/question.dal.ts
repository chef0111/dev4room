import "server-only";

import { db } from "@/database/drizzle";
import { question, tag, tagQuestion, user } from "@/database/schema";
import { and, or, ilike, desc, asc, sql, eq } from "drizzle-orm";
import { getPagination, validateArray, validateOne } from "../utils";
import { TagQuestionService } from "../tag-question/service";
import {
  QuestionDTO,
  QuestionListDTO,
  QuestionListSchema,
  QuestionSchema,
  TagDTO,
  CreateQuestionInput,
  EditQuestionInput,
} from "./question.dto";

type QuestionFilter =
  | "newest"
  | "oldest"
  | "popular"
  | "unanswered"
  | "recommended";

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

export class QuestionDAL {
  private static readonly selectFields = {
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

  private static getSortCriteria(filter?: QuestionFilter) {
    switch (filter) {
      case "newest":
        return desc(question.createdAt);
      case "oldest":
        return asc(question.createdAt);
      case "popular":
        return desc(question.upvotes);
      case "unanswered":
        return eq(question.answers, 0) && desc(question.createdAt);
      case "recommended":
      default:
        return desc(question.createdAt);
    }
  }

  private static buildSearchCondition(query?: string) {
    if (!query) return undefined;
    return or(
      ilike(question.title, `%${query}%`),
      ilike(question.content, `%${query}%`),
    );
  }

  private static mapToDTO(
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
    params: QueryParams,
  ): Promise<{ questions: QuestionListDTO[]; totalQuestions: number }> {
    const { query, filter } = params;
    const { offset, limit } = getPagination(params);

    // Build where conditions
    const conditions = [
      this.buildSearchCondition(query),
      filter === "unanswered" ? eq(question.answers, 0) : undefined,
    ].filter(Boolean);

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const sortCriteria = this.getSortCriteria(filter as QuestionFilter);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(question)
      .where(where);

    // Fetch questions with author
    const rows = await db
      .select(this.selectFields)
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
      rows.map((row) => this.mapToDTO(row, tagsByQuestion[row.id] ?? [])),
      QuestionListSchema,
      "Question",
    );

    return { questions, totalQuestions: count ?? 0 };
  }

  static async findById(questionId: string): Promise<QuestionDTO> {
    const [row] = await db
      .select({ ...this.selectFields, updatedAt: question.updatedAt })
      .from(question)
      .leftJoin(user, eq(question.authorId, user.id))
      .where(eq(question.id, questionId))
      .limit(1);

    if (!row) {
      throw new Error("Question not found");
    }

    const tags = await TagQuestionService.getTagsQuestion(questionId);
    const data = {
      ...this.mapToDTO(row, tags),
      updatedAt: row.updatedAt,
    };

    return validateOne(data, QuestionSchema, "Question");
  }

  static async create(
    input: CreateQuestionInput,
    authorId: string,
  ): Promise<{ id: string }> {
    const { title, content, tags: tagNames } = input;

    return db.transaction(async (tx) => {
      const [newQuestion] = await tx
        .insert(question)
        .values({ title, content, authorId })
        .returning({ id: question.id });

      // Find or create tags and associate with question
      const tagIds = await Promise.all(
        tagNames.map((tagName) => TagQuestionService.findOrCreate(tx, tagName)),
      );

      await TagQuestionService.addTagsToQuestion(tx, newQuestion.id, tagIds);

      return { id: newQuestion.id };
    });
  }

  static async update(
    input: EditQuestionInput,
    userId: string,
  ): Promise<{ id: string; title: string; content: string; tags: TagDTO[] }> {
    const { questionId, title, content, tags: tagNames } = input;

    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select({
          id: question.id,
          title: question.title,
          content: question.content,
          authorId: question.authorId,
        })
        .from(question)
        .where(eq(question.id, questionId))
        .limit(1);

      if (!existing) {
        throw new Error("Question not found");
      }

      if (existing.authorId !== userId) {
        throw new Error("Unauthorized to edit this question");
      }

      if (existing.title !== title || existing.content !== content) {
        await tx
          .update(question)
          .set({ title, content })
          .where(eq(question.id, questionId));
      }

      // Get current tags
      const currentTagsResult = await tx
        .select({ tagId: tag.id, tagName: tag.name })
        .from(tagQuestion)
        .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
        .where(eq(tagQuestion.questionId, questionId));

      const currentTags = currentTagsResult.map((t) => ({
        id: t.tagId,
        name: t.tagName.toLowerCase(),
      }));

      const newTags = tagNames.map((t) => t.toLowerCase().trim());

      const tagsToAdd = newTags.filter(
        (newTag) => !currentTags.some((t) => t.name === newTag),
      );

      const tagsToRemove = currentTags.filter(
        (current) => !newTags.includes(current.name),
      );

      // Add new tags
      if (tagsToAdd.length > 0) {
        const newTagIds = await Promise.all(
          tagsToAdd.map((tagName) =>
            TagQuestionService.findOrCreate(tx, tagName),
          ),
        );
        await TagQuestionService.addTagsToQuestion(tx, questionId, newTagIds);
      }

      // Remove old tags
      if (tagsToRemove.length > 0) {
        const tagIdsToRemove = tagsToRemove.map((t) => t.id);
        await TagQuestionService.decrementQuestionCount(tx, tagIdsToRemove);
        await TagQuestionService.removeTagsFromQuestion(
          tx,
          questionId,
          tagIdsToRemove,
        );
      }

      // Fetch updated tags
      const updatedTags = await tx
        .select({ id: tag.id, name: tag.name })
        .from(tagQuestion)
        .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
        .where(eq(tagQuestion.questionId, questionId));

      return { id: questionId, title, content, tags: updatedTags };
    });
  }

  static async incrementViews(questionId: string): Promise<{ views: number }> {
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

  static async findTop(limit: number = 5) {
    const rows = await db
      .select({
        id: question.id,
        title: question.title,
      })
      .from(question)
      .orderBy(desc(question.views), desc(question.upvotes))
      .limit(limit);

    return rows;
  }
}

export const getQuestions = QuestionDAL.findMany.bind(QuestionDAL);
export const getQuestionById = QuestionDAL.findById.bind(QuestionDAL);
export const createQuestion = QuestionDAL.create.bind(QuestionDAL);
export const editQuestion = QuestionDAL.update.bind(QuestionDAL);
export const incrementQuestionViews =
  QuestionDAL.incrementViews.bind(QuestionDAL);
export const getTopQuestions = QuestionDAL.findTop.bind(QuestionDAL);
