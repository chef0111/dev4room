import "server-only";

import { cacheTag, cacheLife } from "next/cache";

import { db } from "@/database/drizzle";
import {
  question,
  tag,
  tagQuestion,
  user,
  answer,
  vote,
} from "@/database/schema";
import { and, or, ilike, desc, asc, sql, eq, inArray } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
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
import { normalizeText } from "@/lib/utils";

const REPUTATION_THRESHOLD = 1000;
const MAX_PENDING_QUESTIONS = 3;

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
  status: "pending" | "approved" | "rejected";
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
    status: question.status,
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
      ilike(question.content, `%${query}%`)
    );
  }

  private static mapToDTO(
    row: QuestionRow,
    tags: { id: string; name: string }[]
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
      status: row.status,
      tags,
    };
  }

  static async findMany(
    params: QueryParams
  ): Promise<{ questions: QuestionListDTO[]; totalQuestions: number }> {
    const { query, filter } = params;
    const { offset, limit } = getPagination(params);

    // Build where conditions - only show approved questions
    const conditions = [
      eq(question.status, "approved"),
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
      rows.map((r) => r.id)
    );

    const questions = validateArray(
      rows.map((row) => this.mapToDTO(row, tagsByQuestion[row.id] ?? [])),
      QuestionListSchema,
      "Question"
    );

    return { questions, totalQuestions: count ?? 0 };
  }

  static async findById(questionId: string): Promise<QuestionDTO> {
    "use cache";
    cacheLife({ stale: 60, revalidate: 30, expire: 3600 });
    cacheTag(`question:${questionId}`);

    const selectFields = {
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
      status: question.status,
    };

    const [row] = await db
      .select({ ...selectFields, updatedAt: question.updatedAt })
      .from(question)
      .leftJoin(user, eq(question.authorId, user.id))
      .where(eq(question.id, questionId))
      .limit(1);

    if (!row) {
      throw new ORPCError("NOT_FOUND", { message: "Question not found" });
    }

    const tags = await TagQuestionService.getTagsQuestion(questionId);

    const data = {
      id: row.id,
      title: row.title,
      content: row.content,
      views: 0,
      upvotes: row.upvotes,
      downvotes: row.downvotes,
      answers: row.answers,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: {
        id: row.authorId,
        name: row.authorName ?? "Unknown",
        image: row.authorImage,
      },
      status: row.status,
      tags,
    };

    return validateOne(data, QuestionSchema, "Question");
  }

  static async create(
    input: CreateQuestionInput,
    authorId: string,
    authorReputation: number
  ): Promise<{ id: string; status: string }> {
    const { title, content, tags: tagNames } = input;

    // Check pending count for low-rep users
    if (authorReputation < REPUTATION_THRESHOLD) {
      const [pendingCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(question)
        .where(
          and(eq(question.authorId, authorId), eq(question.status, "pending"))
        );

      if ((pendingCount?.count ?? 0) >= MAX_PENDING_QUESTIONS) {
        throw new ORPCError("BAD_REQUEST", {
          message: `You can only have ${MAX_PENDING_QUESTIONS} pending questions at a time. Please wait for admin approval.`,
        });
      }
    }

    const status =
      authorReputation >= REPUTATION_THRESHOLD ? "approved" : "pending";

    return db.transaction(async (tx) => {
      const [newQuestion] = await tx
        .insert(question)
        .values({ title, content, authorId, status })
        .returning({ id: question.id, status: question.status });

      // Find or create tags and associate with question
      const tagIds = await Promise.all(
        tagNames.map((tagName) => TagQuestionService.findOrCreate(tx, tagName))
      );

      await TagQuestionService.addTagsToQuestion(tx, newQuestion.id, tagIds);

      return { id: newQuestion.id, status: newQuestion.status };
    });
  }

  static async update(
    input: EditQuestionInput,
    userId: string
  ): Promise<{
    id: string;
    title: string;
    content: string;
    tags: TagDTO[];
    status: "pending" | "approved" | "rejected";
  }> {
    const { questionId, title, content, tags: tagNames } = input;

    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select({
          id: question.id,
          title: question.title,
          content: question.content,
          authorId: question.authorId,
          status: question.status,
        })
        .from(question)
        .where(eq(question.id, questionId))
        .limit(1);

      if (!existing) {
        throw new ORPCError("NOT_FOUND", { message: "Question not found" });
      }

      if (existing.authorId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not authorized to edit this question",
        });
      }

      if (existing.title !== title || existing.content !== content) {
        // If question was rejected, reset to pending
        const newStatus =
          existing.status === "rejected" ? "pending" : existing.status;
        await tx
          .update(question)
          .set({
            title,
            content,
            status: newStatus,
            rejectReason: existing.status === "rejected" ? null : undefined,
          })
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
        (newTag) => !currentTags.some((t) => t.name === newTag)
      );

      const tagsToRemove = currentTags.filter(
        (current) => !newTags.includes(current.name)
      );

      // Add new tags
      if (tagsToAdd.length > 0) {
        const newTagIds = await Promise.all(
          tagsToAdd.map((tagName) =>
            TagQuestionService.findOrCreate(tx, tagName)
          )
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
          tagIdsToRemove
        );
      }

      // Fetch updated tags
      const updatedTags = await tx
        .select({ id: tag.id, name: tag.name })
        .from(tagQuestion)
        .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
        .where(eq(tagQuestion.questionId, questionId));

      // Return the new status (pending if was rejected and edited)
      const finalStatus =
        existing.status === "rejected" &&
        (existing.title !== title || existing.content !== content)
          ? "pending"
          : existing.status;

      return {
        id: questionId,
        title,
        content,
        tags: updatedTags,
        status: finalStatus,
      };
    });
  }

  static async findTop(limit: number = 5) {
    "use cache";
    cacheLife({ stale: 300, revalidate: 120, expire: 3600 });
    cacheTag("questions");

    const rows = await db
      .select({
        id: question.id,
        title: question.title,
      })
      .from(question)
      .where(eq(question.status, "approved"))
      .orderBy(desc(question.views), desc(question.upvotes))
      .limit(limit);

    return rows;
  }

  static async delete(questionId: string, userId: string): Promise<void> {
    return db.transaction(async (tx) => {
      // Check if question exists and user is the author
      const [existing] = await tx
        .select({
          id: question.id,
          authorId: question.authorId,
        })
        .from(question)
        .where(eq(question.id, questionId))
        .limit(1);

      if (!existing) {
        throw new ORPCError("NOT_FOUND", { message: "Question not found" });
      }

      if (existing.authorId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not authorized to delete this question",
        });
      }

      const questionTags = await tx
        .select({ tagId: tagQuestion.tagId })
        .from(tagQuestion)
        .where(eq(tagQuestion.questionId, questionId));

      if (questionTags.length > 0) {
        await TagQuestionService.decrementQuestionCount(
          tx,
          questionTags.map((t) => t.tagId)
        );
        await TagQuestionService.removeTagsFromQuestion(
          tx,
          questionId,
          questionTags.map((t) => t.tagId)
        );
      }

      const questionAnswers = await tx
        .select({ id: answer.id })
        .from(answer)
        .where(eq(answer.questionId, questionId));

      // Delete votes for the question
      await tx
        .delete(vote)
        .where(
          and(eq(vote.actionId, questionId), eq(vote.actionType, "question"))
        );

      // Delete votes for all answers of the question
      if (questionAnswers.length > 0) {
        await tx.delete(vote).where(
          and(
            inArray(
              vote.actionId,
              questionAnswers.map((a) => a.id)
            ),
            eq(vote.actionType, "answer")
          )
        );
      }

      await tx.delete(question).where(eq(question.id, questionId));
    });
  }

  static async getUserPendingQuestions(userId: string) {
    const rows = await db
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
        status: question.status,
        rejectReason: question.rejectReason,
        createdAt: question.createdAt,
        upvotes: question.upvotes,
        answers: question.answers,
        views: question.views,
        authorId: user.id,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(question)
      .innerJoin(user, eq(question.authorId, user.id))
      .where(
        and(
          eq(question.authorId, userId),
          or(eq(question.status, "pending"), eq(question.status, "rejected"))
        )
      )
      .orderBy(desc(question.createdAt));

    // Fetch tags for all pending questions
    const tagsByQuestion = await TagQuestionService.getTagsQuestions(
      rows.map((r) => r.id)
    );

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      status: row.status,
      rejectReason: row.rejectReason,
      createdAt: row.createdAt,
      upvotes: row.upvotes,
      answers: row.answers,
      views: row.views,
      authorId: row.authorId,
      authorName: row.authorName ?? "Unknown",
      authorImage: row.authorImage,
      tags: tagsByQuestion[row.id] ?? [],
    }));
  }

  static async cancelPendingQuestion(
    questionId: string,
    userId: string
  ): Promise<void> {
    const [existing] = await db
      .select({
        id: question.id,
        authorId: question.authorId,
        status: question.status,
      })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Question not found" });
    }

    if (existing.authorId !== userId) {
      throw new ORPCError("FORBIDDEN", {
        message: "You are not authorized to cancel this question",
      });
    }

    if (existing.status !== "pending" && existing.status !== "rejected") {
      throw new ORPCError("BAD_REQUEST", {
        message: "Only pending or rejected questions can be cancelled",
      });
    }

    await db.delete(question).where(eq(question.id, questionId));
  }

  static async checkDuplicate(params: {
    title: string;
    content: string;
    excludeQuestionId?: string;
  }): Promise<{
    hasDuplicate: boolean;
    duplicates: Array<{
      id: string;
      title: string;
      matchType: "title" | "content";
    }>;
  }> {
    const normalizedTitle = normalizeText(params.title);
    const normalizedContent = normalizeText(params.content);

    // Query all approved questions
    const allQuestions = await db
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
      })
      .from(question)
      .where(
        params.excludeQuestionId
          ? and(
              eq(question.status, "approved"),
              sql`${question.id} != ${params.excludeQuestionId}`
            )
          : eq(question.status, "approved")
      );

    const duplicates: Array<{
      id: string;
      title: string;
      matchType: "title" | "content";
    }> = [];

    for (const q of allQuestions) {
      const qNormalizedTitle = normalizeText(q.title);
      const qNormalizedContent = normalizeText(q.content);

      if (qNormalizedTitle === normalizedTitle) {
        duplicates.push({ id: q.id, title: q.title, matchType: "title" });
      } else if (qNormalizedContent === normalizedContent) {
        duplicates.push({ id: q.id, title: q.title, matchType: "content" });
      }
    }

    return {
      hasDuplicate: duplicates.length > 0,
      duplicates: duplicates.slice(0, 5), // Limit to 5 duplicates
    };
  }
}

export const getQuestions = (
  ...args: Parameters<typeof QuestionDAL.findMany>
) => QuestionDAL.findMany(...args);
export const getQuestionById = (
  ...args: Parameters<typeof QuestionDAL.findById>
) => QuestionDAL.findById(...args);
export const createQuestion = (
  ...args: Parameters<typeof QuestionDAL.create>
) => QuestionDAL.create(...args);
export const editQuestion = (...args: Parameters<typeof QuestionDAL.update>) =>
  QuestionDAL.update(...args);
export const getTopQuestions = (
  ...args: Parameters<typeof QuestionDAL.findTop>
) => QuestionDAL.findTop(...args);
export const deleteQuestion = (
  ...args: Parameters<typeof QuestionDAL.delete>
) => QuestionDAL.delete(...args);
export const getUserPendingQuestions = (
  ...args: Parameters<typeof QuestionDAL.getUserPendingQuestions>
) => QuestionDAL.getUserPendingQuestions(...args);
export const cancelPendingQuestion = (
  ...args: Parameters<typeof QuestionDAL.cancelPendingQuestion>
) => QuestionDAL.cancelPendingQuestion(...args);
export const checkDuplicateQuestion = (
  ...args: Parameters<typeof QuestionDAL.checkDuplicate>
) => QuestionDAL.checkDuplicate(...args);
