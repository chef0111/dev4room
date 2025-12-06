import "server-only";

import { db } from "@/database/drizzle";
import { collection, question } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import {
  ToggleSaveInput,
  HasSavedInput,
  ToggleSaveOutput,
  HasSavedOutput,
} from "./collection.dto";

export class CollectionDAL {
  static async toggleSave(
    input: ToggleSaveInput,
    userId: string,
  ): Promise<ToggleSaveOutput> {
    const { questionId } = input;

    // Check if question exists
    const [existingQuestion] = await db
      .select({ id: question.id })
      .from(question)
      .where(eq(question.id, questionId));

    if (!existingQuestion) {
      throw new ORPCError("NOT_FOUND", { message: "Question not found" });
    }

    // Check if already saved
    const [existingCollection] = await db
      .select({ id: collection.id })
      .from(collection)
      .where(
        and(
          eq(collection.questionId, questionId),
          eq(collection.authorId, userId),
        ),
      );

    if (existingCollection) {
      // Remove from collection
      await db
        .delete(collection)
        .where(eq(collection.id, existingCollection.id));
      return { saved: false };
    }

    // Add to collection
    await db.insert(collection).values({
      questionId,
      authorId: userId,
    });

    return { saved: true };
  }

  static async hasSaved(
    input: HasSavedInput,
    userId: string,
  ): Promise<HasSavedOutput> {
    const { questionId } = input;

    const [existingCollection] = await db
      .select({ id: collection.id })
      .from(collection)
      .where(
        and(
          eq(collection.questionId, questionId),
          eq(collection.authorId, userId),
        ),
      );

    return { saved: !!existingCollection };
  }
}

export const toggleSave = CollectionDAL.toggleSave.bind(CollectionDAL);
export const hasSaved = CollectionDAL.hasSaved.bind(CollectionDAL);
