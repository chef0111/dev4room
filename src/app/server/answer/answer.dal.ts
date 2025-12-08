import "server-only";

import { db } from "@/database/drizzle";
import { answer, question, user } from "@/database/schema";
import { desc, sql, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { getPagination, validateArray, validateOne } from "../utils";
import {
  AnswerDTO,
  AnswerListDTO,
  AnswerListSchema,
  AnswerSchema,
  CreateAnswerInput,
} from "./answer.dto";

// Reputation points awarded for posting an answer
const REPUTATION_POINT_FOR_ANSWER = 10;

// Type for raw database row with joined author info
interface AnswerRow {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string | null;
  authorImage: string | null;
}

export class AnswerDAL {
  // Fields to select when querying answers with author info
  private static readonly selectFields = {
    id: answer.id,
    content: answer.content,
    upvotes: answer.upvotes,
    downvotes: answer.downvotes,
    createdAt: answer.createdAt,
    updatedAt: answer.updatedAt,
    authorId: answer.authorId,
    authorName: user.name,
    authorImage: user.image,
  } as const;

  // Transform raw DB row into DTO shape
  private static mapToDTO(row: AnswerRow) {
    return {
      id: row.id,
      content: row.content,
      upvotes: row.upvotes,
      downvotes: row.downvotes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: {
        id: row.authorId,
        name: row.authorName ?? "Unknown",
        image: row.authorImage,
      },
    };
  }

  /**
   * Create a new answer for a question
   * Transaction: INSERT answer + UPDATE question.answers + UPDATE user.reputation
   */
  static async create(
    input: CreateAnswerInput,
    authorId: string,
  ): Promise<AnswerDTO> {
    const { questionId, content } = input;

    return db.transaction(async (tx) => {
      // 1. Verify question exists
      const [existingQuestion] = await tx
        .select({ id: question.id })
        .from(question)
        .where(eq(question.id, questionId))
        .limit(1);

      if (!existingQuestion) {
        throw new ORPCError("NOT_FOUND", { message: "Question not found" });
      }

      // 2. Insert the answer
      const [newAnswer] = await tx
        .insert(answer)
        .values({
          content,
          authorId,
          questionId,
        })
        .returning({
          id: answer.id,
          content: answer.content,
          upvotes: answer.upvotes,
          downvotes: answer.downvotes,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
          authorId: answer.authorId,
        });

      // 3. Increment question's answer count
      await tx
        .update(question)
        .set({ answers: sql`${question.answers} + 1` })
        .where(eq(question.id, questionId));
      
      // 4. Increment author's reputation
      await tx
        .update(user)
        .set({ reputation: sql`${user.reputation} + ${REPUTATION_POINT_FOR_ANSWER}` })
        .where(eq(user.id, authorId));
      
      // 5. Fetch author info for the response
      const [authorInfo] = await tx
        .select({ name: user.name, image: user.image })
        .from(user)
        .where(eq(user.id, authorId))
        .limit(1);

      // 6. Map to DTO and validate
      const data = this.mapToDTO({
        ...newAnswer,
        authorName: authorInfo?.name ?? null,
        authorImage: authorInfo?.image ?? null,
      });

      return validateOne(data, AnswerSchema, "Answer");
    });
  }

  /**
   * Get all answers for a specific question with pagination
   */
  static async findByQuestionId(
    questionId: string,
    params: QueryParams,
  ): Promise<{ answers: AnswerListDTO[]; totalAnswers: number }> {
    const { offset, limit } = getPagination(params);

    // Verify question exists
    const [existingQuestion] = await db
      .select({ id: question.id })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!existingQuestion) {
      throw new ORPCError("NOT_FOUND", { message: "Question not found" });
    }

    // Get total count of answers for this question
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(answer)
      .where(eq(answer.questionId, questionId));

    // Fetch answers with author info
    const rows = await db
      .select(this.selectFields)
      .from(answer)
      .leftJoin(user, eq(answer.authorId, user.id))
      .where(eq(answer.questionId, questionId))
      .orderBy(desc(answer.createdAt)) // Newest first
      .limit(limit)
      .offset(offset);

    // Map and validate each answer
    const answers = validateArray(
      rows.map((row) => this.mapToDTO(row)),
      AnswerListSchema,
      "Answer",
    );

    return { answers, totalAnswers: count ?? 0 };
  }

  /**
   * Get a single answer by ID
   */
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
}

// Export bound functions for use in route handlers
export const createAnswer = AnswerDAL.create.bind(AnswerDAL);
export const getAnswersByQuestionId = AnswerDAL.findByQuestionId.bind(AnswerDAL);
export const getAnswerById = AnswerDAL.findById.bind(AnswerDAL);
