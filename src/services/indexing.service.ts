import "server-only";

import { db } from "@/database/drizzle";
import { question, answer, tag, user } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { EmbeddingService } from "./embedding.service";

export class IndexingService {
  // Index a question (call after create/update)
  static async indexQuestion(questionId: string): Promise<void> {
    const [q] = await db
      .select({ title: question.title, content: question.content })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!q) return;

    const text = EmbeddingService.prepareQuestionText(q.title, q.content);
    const embedding = await EmbeddingService.generateEmbedding(text);

    await db
      .update(question)
      .set({ embedding })
      .where(eq(question.id, questionId));
  }

  // Index an answer (call after create/update)
  static async indexAnswer(answerId: string): Promise<void> {
    const [a] = await db
      .select({ content: answer.content })
      .from(answer)
      .where(eq(answer.id, answerId))
      .limit(1);

    if (!a) return;

    const text = EmbeddingService.prepareAnswerText(a.content);
    const embedding = await EmbeddingService.generateEmbedding(text);

    await db.update(answer).set({ embedding }).where(eq(answer.id, answerId));
  }

  // Index a tag (call after create/update)
  static async indexTag(tagId: string): Promise<void> {
    const [t] = await db
      .select({ name: tag.name })
      .from(tag)
      .where(eq(tag.id, tagId))
      .limit(1);

    if (!t) return;

    const text = EmbeddingService.prepareTagText(t.name);
    const embedding = await EmbeddingService.generateEmbedding(text);

    await db.update(tag).set({ embedding }).where(eq(tag.id, tagId));
  }

  // Index a user (call after create/update)
  static async indexUser(userId: string): Promise<void> {
    const [u] = await db
      .select({ name: user.name, username: user.username, bio: user.bio })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!u) return;

    const text = EmbeddingService.prepareUserText(u.name, u.username, u.bio);
    const embedding = await EmbeddingService.generateEmbedding(text);

    await db.update(user).set({ embedding }).where(eq(user.id, userId));
  }

  // Bulk index all questions without embeddings
  static async indexAllQuestions(): Promise<number> {
    const questions = await db
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
      })
      .from(question)
      .where(sql`${question.embedding} IS NULL`);

    if (questions.length === 0) return 0;

    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const texts = batch.map((q) =>
        EmbeddingService.prepareQuestionText(q.title, q.content)
      );
      const embeddings = await EmbeddingService.generateEmbeddings(texts);

      await Promise.all(
        batch.map((q, idx) =>
          db
            .update(question)
            .set({ embedding: embeddings[idx] })
            .where(eq(question.id, q.id))
        )
      );

      // Small delay between batches to avoid rate limits
      if (i + batchSize < questions.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return questions.length;
  }

  // Bulk index all answers without embeddings
  static async indexAllAnswers(): Promise<number> {
    const answers = await db
      .select({ id: answer.id, content: answer.content })
      .from(answer)
      .where(sql`${answer.embedding} IS NULL`);

    if (answers.length === 0) return 0;

    const batchSize = 10;
    for (let i = 0; i < answers.length; i += batchSize) {
      const batch = answers.slice(i, i + batchSize);
      const texts = batch.map((a) =>
        EmbeddingService.prepareAnswerText(a.content)
      );
      const embeddings = await EmbeddingService.generateEmbeddings(texts);

      await Promise.all(
        batch.map((a, idx) =>
          db
            .update(answer)
            .set({ embedding: embeddings[idx] })
            .where(eq(answer.id, a.id))
        )
      );

      if (i + batchSize < answers.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return answers.length;
  }

  // Bulk index all tags without embeddings
  static async indexAllTags(): Promise<number> {
    const tags = await db
      .select({ id: tag.id, name: tag.name })
      .from(tag)
      .where(sql`${tag.embedding} IS NULL`);

    if (tags.length === 0) return 0;

    const batchSize = 20;
    for (let i = 0; i < tags.length; i += batchSize) {
      const batch = tags.slice(i, i + batchSize);
      const texts = batch.map((t) => EmbeddingService.prepareTagText(t.name));
      const embeddings = await EmbeddingService.generateEmbeddings(texts);

      await Promise.all(
        batch.map((t, idx) =>
          db
            .update(tag)
            .set({ embedding: embeddings[idx] })
            .where(eq(tag.id, t.id))
        )
      );

      if (i + batchSize < tags.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return tags.length;
  }

  // Bulk index all users without embeddings
  static async indexAllUsers(): Promise<number> {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        bio: user.bio,
      })
      .from(user)
      .where(sql`${user.embedding} IS NULL`);

    if (users.length === 0) return 0;

    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const texts = batch.map((u) =>
        EmbeddingService.prepareUserText(u.name, u.username, u.bio)
      );
      const embeddings = await EmbeddingService.generateEmbeddings(texts);

      await Promise.all(
        batch.map((u, idx) =>
          db
            .update(user)
            .set({ embedding: embeddings[idx] })
            .where(eq(user.id, u.id))
        )
      );

      if (i + batchSize < users.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return users.length;
  }

  // Index all entities
  static async indexAll(): Promise<{
    questions: number;
    answers: number;
    tags: number;
    users: number;
  }> {
    const [questions, answers, tags, users] = await Promise.all([
      this.indexAllQuestions(),
      this.indexAllAnswers(),
      this.indexAllTags(),
      this.indexAllUsers(),
    ]);

    return { questions, answers, tags, users };
  }
}

export const indexQuestion =
  IndexingService.indexQuestion.bind(IndexingService);
export const indexAnswer = IndexingService.indexAnswer.bind(IndexingService);
export const indexTag = IndexingService.indexTag.bind(IndexingService);
export const indexUser = IndexingService.indexUser.bind(IndexingService);
export const indexAll = IndexingService.indexAll.bind(IndexingService);
