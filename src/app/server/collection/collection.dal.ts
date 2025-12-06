import "server-only";

import { db } from "@/database/drizzle";
import { collection, question, user } from "@/database/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { getPagination, validateArray } from "../utils";
import { TagQuestionService } from "../tag-question/service";
import {
  ToggleSaveInput,
  HasSavedInput,
  ToggleSaveOutput,
  HasSavedOutput,
  CollectionItem,
  CollectionItemSchema,
  CollectionFilter,
} from "./collection.dto";

interface CollectionRow {
  id: string;
  savedAt: Date;
  questionId: string;
  questionTitle: string;
  questionContent: string;
  questionViews: number;
  questionUpvotes: number;
  questionDownvotes: number;
  questionAnswers: number;
  questionCreatedAt: Date;
  authorId: string;
  authorName: string | null;
  authorImage: string | null;
}

export class CollectionDAL {
  private static readonly selectFields = {
    id: collection.id,
    savedAt: collection.createdAt,
    questionId: question.id,
    questionTitle: question.title,
    questionContent: question.content,
    questionViews: question.views,
    questionUpvotes: question.upvotes,
    questionDownvotes: question.downvotes,
    questionAnswers: question.answers,
    questionCreatedAt: question.createdAt,
    authorId: user.id,
    authorName: user.name,
    authorImage: user.image,
  } as const;

  private static getSortCriteria(filter?: CollectionFilter) {
    switch (filter) {
      case "mostRecent":
        return desc(question.createdAt);
      case "oldest":
        return asc(question.createdAt);
      case "mostVoted":
        return desc(question.upvotes);
      case "mostViewed":
        return desc(question.views);
      case "mostAnswered":
        return desc(question.answers);
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
    row: CollectionRow,
    tags: { id: string; name: string }[],
  ): CollectionItem {
    return {
      id: row.id,
      question: {
        id: row.questionId,
        title: row.questionTitle,
        content: row.questionContent,
        views: row.questionViews,
        upvotes: row.questionUpvotes,
        downvotes: row.questionDownvotes,
        answers: row.questionAnswers,
        createdAt: row.questionCreatedAt,
        author: {
          id: row.authorId,
          name: row.authorName ?? "Unknown",
          image: row.authorImage,
        },
        tags,
      },
      savedAt: row.savedAt,
    };
  }

  static async findMany(
    input: QueryParams,
    userId: string,
  ): Promise<{ collections: CollectionItem[]; totalCollections: number }> {
    const { query, filter } = input;
    const { offset, limit } = getPagination(input);

    // Build conditions: user's collection + optional search
    const searchCondition = this.buildSearchCondition(query);
    const baseCondition = eq(collection.authorId, userId);
    const where = searchCondition
      ? and(baseCondition, searchCondition)
      : baseCondition;

    // Count total
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(collection)
      .innerJoin(question, eq(collection.questionId, question.id))
      .where(where);

    // Fetch collections with question and author
    const rows = await db
      .select(this.selectFields)
      .from(collection)
      .innerJoin(question, eq(collection.questionId, question.id))
      .innerJoin(user, eq(question.authorId, user.id))
      .where(where)
      .orderBy(this.getSortCriteria(filter as CollectionFilter))
      .limit(limit)
      .offset(offset);

    // Fetch tags for all questions
    const tagsByQuestion = await TagQuestionService.getTagsQuestions(
      rows.map((r) => r.questionId),
    );

    const collections = validateArray(
      rows.map((row) =>
        this.mapToDTO(row, tagsByQuestion[row.questionId] ?? []),
      ),
      CollectionItemSchema,
      "Collection",
    );

    return { collections, totalCollections: count ?? 0 };
  }

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

export const listCollection = CollectionDAL.findMany.bind(CollectionDAL);
export const toggleSave = CollectionDAL.toggleSave.bind(CollectionDAL);
export const hasSaved = CollectionDAL.hasSaved.bind(CollectionDAL);
