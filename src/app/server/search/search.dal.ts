import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { question, answer, tag, user } from "@/database/schema";
import { generateEmbedding } from "@/services/embedding.service";
import {
  SearchInput,
  SearchResult,
  QuestionResult,
  AnswerResult,
  TagResult,
  UserResult,
} from "./search.dto";

export class SearchDAL {
  // Perform semantic search across all entity types
  static async search(input: SearchInput): Promise<SearchResult> {
    const { query, limit, types } = input;

    // Generate embedding for search query
    const normalizedQuery = query.toLowerCase().trim();
    const queryEmbedding = await generateEmbedding(normalizedQuery);
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    // Run searches in parallel for enabled types
    const [questions, answers, tags, users] = await Promise.all([
      types.includes("question")
        ? this.searchQuestions(embeddingString, limit)
        : Promise.resolve([]),
      types.includes("answer")
        ? this.searchAnswers(embeddingString, limit)
        : Promise.resolve([]),
      types.includes("tag")
        ? this.searchTags(embeddingString, limit)
        : Promise.resolve([]),
      types.includes("user")
        ? this.searchUsers(embeddingString, limit)
        : Promise.resolve([]),
    ]);

    return { questions, answers, tags, users };
  }

  private static async searchQuestions(
    embeddingString: string,
    limit: number,
  ): Promise<QuestionResult[]> {
    const results = await db
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
        authorId: question.authorId,
        authorName: user.name,
        authorImage: user.image,
        upvotes: question.upvotes,
        answers: question.answers,
        createdAt: question.createdAt,
        similarity: sql<number>`1 - (${question.embedding} <=> ${embeddingString}::vector)`,
      })
      .from(question)
      .leftJoin(user, sql`${question.authorId} = ${user.id}`)
      .where(sql`${question.embedding} IS NOT NULL`)
      .orderBy(sql`${question.embedding} <=> ${embeddingString}::vector`)
      .limit(limit);

    return results.map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      authorId: r.authorId,
      authorName: r.authorName,
      authorImage: r.authorImage,
      upvotes: r.upvotes,
      answers: r.answers,
      createdAt: r.createdAt,
      similarity: Number(r.similarity),
    }));
  }

  private static async searchAnswers(
    embeddingString: string,
    limit: number,
  ): Promise<AnswerResult[]> {
    const results = await db
      .select({
        id: answer.id,
        content: answer.content,
        questionId: answer.questionId,
        questionTitle: question.title,
        authorId: answer.authorId,
        authorName: user.name,
        authorImage: user.image,
        upvotes: answer.upvotes,
        createdAt: answer.createdAt,
        similarity: sql<number>`1 - (${answer.embedding} <=> ${embeddingString}::vector)`,
      })
      .from(answer)
      .leftJoin(question, sql`${answer.questionId} = ${question.id}`)
      .leftJoin(user, sql`${answer.authorId} = ${user.id}`)
      .where(sql`${answer.embedding} IS NOT NULL`)
      .orderBy(sql`${answer.embedding} <=> ${embeddingString}::vector`)
      .limit(limit);

    return results.map((r) => ({
      id: r.id,
      content: r.content,
      questionId: r.questionId,
      questionTitle: r.questionTitle ?? "Unknown Question",
      authorId: r.authorId,
      authorName: r.authorName,
      authorImage: r.authorImage,
      upvotes: r.upvotes,
      createdAt: r.createdAt,
      similarity: Number(r.similarity),
    }));
  }

  private static async searchTags(
    embeddingString: string,
    limit: number,
  ): Promise<TagResult[]> {
    const results = await db
      .select({
        id: tag.id,
        name: tag.name,
        questions: tag.questions,
        similarity: sql<number>`1 - (${tag.embedding} <=> ${embeddingString}::vector)`,
      })
      .from(tag)
      .where(sql`${tag.embedding} IS NOT NULL`)
      .orderBy(sql`${tag.embedding} <=> ${embeddingString}::vector`)
      .limit(limit);

    return results.map((r) => ({
      id: r.id,
      name: r.name,
      questions: r.questions,
      similarity: Number(r.similarity),
    }));
  }

  private static async searchUsers(
    embeddingString: string,
    limit: number,
  ): Promise<UserResult[]> {
    const results = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        bio: user.bio,
        reputation: user.reputation,
        similarity: sql<number>`1 - (${user.embedding} <=> ${embeddingString}::vector)`,
      })
      .from(user)
      .where(sql`${user.embedding} IS NOT NULL`)
      .orderBy(sql`${user.embedding} <=> ${embeddingString}::vector`)
      .limit(limit);

    return results.map((r) => ({
      id: r.id,
      name: r.name,
      username: r.username,
      image: r.image,
      bio: r.bio,
      reputation: r.reputation,
      similarity: Number(r.similarity),
    }));
  }
}

export const search = SearchDAL.search.bind(SearchDAL);
