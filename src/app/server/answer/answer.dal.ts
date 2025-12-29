import "server-only";

import { db } from "@/database/drizzle";
import { answer, question, user, vote } from "@/database/schema";
import { and, desc, asc, sql, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { getPagination, validateArray, validateOne } from "../utils";
import {
  AnswerDTO,
  AnswerSchema,
  CreateAnswerInput,
  EditAnswerInput,
  ListAnswersInput,
} from "./answer.dto";

type AnswerFilter = "latest" | "oldest" | "popular";

interface AnswerRow {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string | null;
  authorUsername: string | null;
  authorImage: string | null;
}

export class AnswerDAL {
  private static readonly selectFields = {
    id: answer.id,
    content: answer.content,
    upvotes: answer.upvotes,
    downvotes: answer.downvotes,
    questionId: answer.questionId,
    createdAt: answer.createdAt,
    updatedAt: answer.updatedAt,
    authorId: answer.authorId,
    authorName: user.name,
    authorUsername: user.username,
    authorImage: user.image,
  } as const;

  private static getSortCriteria(filter?: AnswerFilter) {
    switch (filter) {
      case "latest":
        return desc(answer.createdAt);
      case "oldest":
        return asc(answer.createdAt);
      case "popular":
        return desc(answer.upvotes);
      default:
        return desc(answer.createdAt);
    }
  }

  private static mapToDTO(row: AnswerRow): AnswerDTO {
    return {
      id: row.id,
      content: row.content,
      upvotes: row.upvotes,
      downvotes: row.downvotes,
      questionId: row.questionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: {
        id: row.authorId,
        name: row.authorName ?? "Unknown",
        username: row.authorUsername ?? "unknown",
        image: row.authorImage,
      },
    };
  }

  static async findMany(
    params: ListAnswersInput
  ): Promise<{ answers: AnswerDTO[]; totalAnswers: number }> {
    const { questionId, filter } = params;
    const { offset, limit } = getPagination(params);

    const sortCriteria = this.getSortCriteria(filter as AnswerFilter);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(answer)
      .where(eq(answer.questionId, questionId));

    const rows = await db
      .select(this.selectFields)
      .from(answer)
      .leftJoin(user, eq(answer.authorId, user.id))
      .where(eq(answer.questionId, questionId))
      .orderBy(sortCriteria)
      .limit(limit)
      .offset(offset);

    const answers = validateArray(
      rows.map((row) => this.mapToDTO(row)),
      AnswerSchema,
      "Answer"
    );

    return { answers, totalAnswers: count ?? 0 };
  }

  static async findById(answerId: string): Promise<AnswerDTO> {
    const [row] = await db
      .select(this.selectFields)
      .from(answer)
      .leftJoin(user, eq(answer.authorId, user.id))
      .where(eq(answer.id, answerId))
      .limit(1);

    if (!row) {
      throw new ORPCError("NOT_FOUND", { message: "Answer not found" });
    }

    return validateOne(this.mapToDTO(row), AnswerSchema, "Answer");
  }

  static async create(
    input: CreateAnswerInput,
    authorId: string
  ): Promise<{ id: string }> {
    const { questionId, content } = input;

    return db.transaction(async (tx) => {
      const [existingQuestion] = await tx
        .select({ id: question.id })
        .from(question)
        .where(eq(question.id, questionId))
        .limit(1);

      if (!existingQuestion) {
        throw new ORPCError("NOT_FOUND", { message: "Question not found" });
      }

      // Create answer
      const [newAnswer] = await tx
        .insert(answer)
        .values({ content, authorId, questionId })
        .returning({ id: answer.id });

      // Increment question's answer count
      await tx
        .update(question)
        .set({ answers: sql`${question.answers} + 1` })
        .where(eq(question.id, questionId));

      return { id: newAnswer.id };
    });
  }

  static async update(
    input: EditAnswerInput,
    userId: string
  ): Promise<{ id: string; content: string }> {
    const { answerId, content } = input;

    const [existing] = await db
      .select({
        id: answer.id,
        content: answer.content,
        authorId: answer.authorId,
      })
      .from(answer)
      .where(eq(answer.id, answerId))
      .limit(1);

    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Answer not found" });
    }

    if (existing.authorId !== userId) {
      throw new ORPCError("FORBIDDEN", {
        message: "You are not authorized to edit this answer",
      });
    }

    if (existing.content !== content) {
      await db.update(answer).set({ content }).where(eq(answer.id, answerId));
    }

    return { id: answerId, content };
  }

  static async delete(answerId: string, userId: string): Promise<void> {
    return db.transaction(async (tx) => {
      // Check if answer exists and user is the author
      const [existing] = await tx
        .select({
          id: answer.id,
          authorId: answer.authorId,
          questionId: answer.questionId,
        })
        .from(answer)
        .where(eq(answer.id, answerId))
        .limit(1);

      if (!existing) {
        throw new ORPCError("NOT_FOUND", { message: "Answer not found" });
      }

      if (existing.authorId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not authorized to delete this answer",
        });
      }

      // Delete votes for this answer
      await tx
        .delete(vote)
        .where(and(eq(vote.actionId, answerId), eq(vote.actionType, "answer")));

      // Delete the answer
      await tx.delete(answer).where(eq(answer.id, answerId));

      // Decrement question's answer count
      await tx
        .update(question)
        .set({ answers: sql`${question.answers} - 1` })
        .where(eq(question.id, existing.questionId));
    });
  }

  static async findAnswerPage(
    answerId: string,
    questionId: string,
    pageSize: number = 10,
    filter: AnswerFilter = "latest"
  ): Promise<number> {
    const sortCriteria = this.getSortCriteria(filter);

    // Get all answer IDs in order
    const rows = await db
      .select({ id: answer.id })
      .from(answer)
      .where(eq(answer.questionId, questionId))
      .orderBy(sortCriteria);

    const index = rows.findIndex((row) => row.id === answerId);

    if (index === -1) {
      return 1; // Default to page 1 if answer not found
    }

    return Math.floor(index / pageSize) + 1;
  }
}

export const getAnswers = (...args: Parameters<typeof AnswerDAL.findMany>) =>
  AnswerDAL.findMany(...args);
export const getAnswerById = (...args: Parameters<typeof AnswerDAL.findById>) =>
  AnswerDAL.findById(...args);
export const createAnswer = (...args: Parameters<typeof AnswerDAL.create>) =>
  AnswerDAL.create(...args);
export const editAnswer = (...args: Parameters<typeof AnswerDAL.update>) =>
  AnswerDAL.update(...args);
export const deleteAnswer = (...args: Parameters<typeof AnswerDAL.delete>) =>
  AnswerDAL.delete(...args);
export const getAnswerPage = (
  ...args: Parameters<typeof AnswerDAL.findAnswerPage>
) => AnswerDAL.findAnswerPage(...args);
