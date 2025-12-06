import "server-only";

import { db } from "@/database/drizzle";
import { interaction, user } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { validateOne } from "../utils";
import {
  InteractionDTO,
  InteractionSchema,
  CreateInteractionInput,
  InteractionAction,
} from "./interaction.dto";

interface ReputationChange {
  performerPoints: number;
  authorPoints: number;
}

export class InteractionDAL {
  private static readonly selectFields = {
    id: interaction.id,
    userId: interaction.userId,
    action: interaction.action,
    actionId: interaction.actionId,
    actionType: interaction.actionType,
    createdAt: interaction.createdAt,
  } as const;

  private static getReputationChange(
    action: InteractionAction,
    actionType: "question" | "answer",
  ): ReputationChange {
    switch (action) {
      case "upvote":
        return { performerPoints: 2, authorPoints: 10 };
      case "downvote":
        return { performerPoints: -1, authorPoints: -2 };
      case "post":
        return {
          performerPoints: 0,
          authorPoints: actionType === "question" ? 5 : 10,
        };
      case "delete":
        return {
          performerPoints: 0,
          authorPoints: actionType === "question" ? -5 : -10,
        };
      default:
        return { performerPoints: 0, authorPoints: 0 };
    }
  }

  private static async updateReputation(
    performerId: string,
    authorId: string,
    action: InteractionAction,
    actionType: "question" | "answer",
  ): Promise<void> {
    const { performerPoints, authorPoints } = this.getReputationChange(
      action,
      actionType,
    );

    // If performer is the author, only apply author points once
    if (performerId === authorId) {
      if (authorPoints !== 0) {
        await db
          .update(user)
          .set({ reputation: sql`${user.reputation} + ${authorPoints}` })
          .where(eq(user.id, performerId));
      }
      return;
    }

    // Update performer reputation
    if (performerPoints !== 0) {
      await db
        .update(user)
        .set({ reputation: sql`${user.reputation} + ${performerPoints}` })
        .where(eq(user.id, performerId));
    }

    // Update author reputation
    if (authorPoints !== 0) {
      await db
        .update(user)
        .set({ reputation: sql`${user.reputation} + ${authorPoints}` })
        .where(eq(user.id, authorId));
    }
  }

  static async create(
    input: CreateInteractionInput,
    userId: string,
  ): Promise<InteractionDTO> {
    const { action, actionType, actionId, authorId } = input;

    // Create the interaction
    const [created] = await db
      .insert(interaction)
      .values({
        userId,
        action,
        actionId,
        actionType,
      })
      .returning(this.selectFields);

    if (!created) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to create interaction",
      });
    }

    // Update reputation for both performer and author
    await this.updateReputation(
      userId,
      authorId,
      action as InteractionAction,
      actionType as "question" | "answer",
    );

    return validateOne(created, InteractionSchema, "Interaction");
  }

  static async findByUserAndAction(
    userId: string,
    actionId: string,
    action: InteractionAction,
  ): Promise<InteractionDTO | null> {
    const [row] = await db
      .select(this.selectFields)
      .from(interaction)
      .where(
        and(
          eq(interaction.userId, userId),
          eq(interaction.actionId, actionId),
          eq(interaction.action, action),
        ),
      );

    if (!row) return null;

    return validateOne(row, InteractionSchema, "Interaction");
  }
}

export const createInteraction = InteractionDAL.create.bind(InteractionDAL);
export const findInteractionByUserAndAction =
  InteractionDAL.findByUserAndAction.bind(InteractionDAL);
