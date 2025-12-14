import "server-only";

import { db } from "@/database/drizzle";
import { tag, tagQuestion } from "@/database/schema";
import { eq, ilike, sql, inArray, and } from "drizzle-orm";
import type { Transaction } from "../utils";

const pendingTagIndexing: Set<string> = new Set();

export class TagQuestionService {
  static async findOrCreate(tx: Transaction, tagName: string): Promise<string> {
    const normalizedName = tagName.toLowerCase().trim();

    // Try to find existing tag
    const [existingTag] = await tx
      .select({ id: tag.id })
      .from(tag)
      .where(ilike(tag.name, normalizedName))
      .limit(1);

    if (existingTag) {
      // Increment question count for existing tag
      await tx
        .update(tag)
        .set({ questions: sql`${tag.questions} + 1` })
        .where(eq(tag.id, existingTag.id));

      return existingTag.id;
    }

    // Create new tag
    const [newTag] = await tx
      .insert(tag)
      .values({ name: normalizedName, questions: 1 })
      .returning({ id: tag.id });

    pendingTagIndexing.add(newTag.id);

    return newTag.id;
  }

  static getPendingTagIds(): string[] {
    const ids = Array.from(pendingTagIndexing);
    pendingTagIndexing.clear();
    return ids;
  }

  static async decrementQuestionCount(
    tx: Transaction,
    tagIds: string[]
  ): Promise<void> {
    if (tagIds.length === 0) return;

    await tx
      .update(tag)
      .set({ questions: sql`${tag.questions} - 1` })
      .where(inArray(tag.id, tagIds));
  }

  static async getTagsQuestion(
    questionId: string
  ): Promise<{ id: string; name: string }[]> {
    return db
      .select({ id: tag.id, name: tag.name })
      .from(tagQuestion)
      .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
      .where(eq(tagQuestion.questionId, questionId));
  }

  static async getTagsQuestions(
    questionIds: string[]
  ): Promise<Record<string, { id: string; name: string }[]>> {
    if (questionIds.length === 0) return {};

    const tags = await db
      .select({
        questionId: tagQuestion.questionId,
        tagId: tag.id,
        tagName: tag.name,
      })
      .from(tagQuestion)
      .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
      .where(inArray(tagQuestion.questionId, questionIds));

    return tags.reduce(
      (acc, t) => {
        (acc[t.questionId] ??= []).push({ id: t.tagId, name: t.tagName });
        return acc;
      },
      {} as Record<string, { id: string; name: string }[]>
    );
  }

  static async addTagsToQuestion(
    tx: Transaction,
    questionId: string,
    tagIds: string[]
  ): Promise<void> {
    if (tagIds.length === 0) return;

    await tx
      .insert(tagQuestion)
      .values(tagIds.map((tagId) => ({ questionId, tagId })));
  }

  static async removeTagsFromQuestion(
    tx: Transaction,
    questionId: string,
    tagIds: string[]
  ): Promise<void> {
    if (tagIds.length === 0) return;

    await tx
      .delete(tagQuestion)
      .where(
        and(
          eq(tagQuestion.questionId, questionId),
          inArray(tagQuestion.tagId, tagIds)
        )
      );
  }
}
