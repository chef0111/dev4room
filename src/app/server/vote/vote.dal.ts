import "server-only";

import { db } from "@/database/drizzle";
import { vote, question, answer } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import {
  CreateVoteInput,
  HasVotedInput,
  HasVotedOutput,
  VoteType,
  TargetType,
} from "./vote.dto";

export class VoteDAL {
  private static async updateVoteCount(
    targetId: string,
    targetType: TargetType,
    voteType: VoteType,
    change: 1 | -1,
  ): Promise<void> {
    const table = targetType === "question" ? question : answer;
    const field = voteType === "upvote" ? "upvotes" : "downvotes";

    await db
      .update(table)
      .set({
        [field]: sql`${table[field]} + ${change}`,
      })
      .where(eq(table.id, targetId));
  }

  private static async getContentAuthorId(
    targetId: string,
    targetType: TargetType,
  ): Promise<string> {
    if (targetType === "question") {
      const [row] = await db
        .select({ authorId: question.authorId })
        .from(question)
        .where(eq(question.id, targetId));

      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "Question not found" });
      }
      return row.authorId;
    } else {
      const [row] = await db
        .select({ authorId: answer.authorId })
        .from(answer)
        .where(eq(answer.id, targetId));

      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "Answer not found" });
      }
      return row.authorId;
    }
  }

  static async createVote(
    input: CreateVoteInput,
    userId: string,
  ): Promise<{ success: boolean; contentAuthorId: string }> {
    const { targetId, targetType, voteType } = input;

    // Get content author for interaction tracking
    const contentAuthorId = await this.getContentAuthorId(targetId, targetType);

    // Check for existing vote
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(
        and(
          eq(vote.authorId, userId),
          eq(vote.actionId, targetId),
          eq(vote.actionType, targetType),
        ),
      );

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote type - remove vote (toggle off)
        await db.delete(vote).where(eq(vote.id, existingVote.id));
        await this.updateVoteCount(targetId, targetType, voteType, -1);
      } else {
        // Different vote type - change vote
        await db
          .update(vote)
          .set({ voteType })
          .where(eq(vote.id, existingVote.id));

        // Decrement old vote type, increment new vote type
        await this.updateVoteCount(
          targetId,
          targetType,
          existingVote.voteType as VoteType,
          -1,
        );
        await this.updateVoteCount(targetId, targetType, voteType, 1);
      }
    } else {
      // No existing vote - create new vote
      await db.insert(vote).values({
        authorId: userId,
        actionId: targetId,
        actionType: targetType,
        voteType,
      });
      await this.updateVoteCount(targetId, targetType, voteType, 1);
    }

    return { success: true, contentAuthorId };
  }

  static async hasVoted(
    input: HasVotedInput,
    userId: string,
  ): Promise<HasVotedOutput> {
    const { targetId, targetType } = input;

    const [existingVote] = await db
      .select({ voteType: vote.voteType })
      .from(vote)
      .where(
        and(
          eq(vote.authorId, userId),
          eq(vote.actionId, targetId),
          eq(vote.actionType, targetType),
        ),
      );

    if (!existingVote) {
      return { hasUpvoted: false, hasDownvoted: false };
    }

    return {
      hasUpvoted: existingVote.voteType === "upvote",
      hasDownvoted: existingVote.voteType === "downvote",
    };
  }
}

export const createVote = VoteDAL.createVote.bind(VoteDAL);
export const hasVoted = VoteDAL.hasVoted.bind(VoteDAL);
