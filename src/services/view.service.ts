import "server-only";

import { db } from "@/database/drizzle";
import { question } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export class ViewService {
  static async incrementQuestionViews(questionId: string): Promise<void> {
    await db
      .update(question)
      .set({ views: sql`${question.views} + 1` })
      .where(eq(question.id, questionId));
  }

  static async getViewCount(questionId: string): Promise<number> {
    const [row] = await db
      .select({ views: question.views })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);
    return row?.views ?? 0;
  }
}
