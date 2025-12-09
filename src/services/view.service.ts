import "server-only";

import { db } from "@/database/drizzle";
import { question, interaction } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export class ViewService {
  static async incrementQuestionViews(questionId: string): Promise<void> {
    await db
      .update(question)
      .set({ views: sql`${question.views} + 1` })
      .where(eq(question.id, questionId));
  }

  static async trackAnonymousView(
    actionId: string,
    actionType: "question" | "answer",
  ): Promise<void> {
    await db.insert(interaction).values({
      userId: "anonymous",
      action: "view",
      actionId,
      actionType,
    });
  }

  static async processQueuedViews(
    views: { questionId: string; count: number }[],
  ): Promise<void> {
    for (const { questionId, count } of views) {
      await db
        .update(question)
        .set({ views: sql`${question.views} + ${count}` })
        .where(eq(question.id, questionId));
    }
  }
}
