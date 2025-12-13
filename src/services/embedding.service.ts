import "server-only";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-large";
const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS ?? 2000);

export class EmbeddingService {
  // Generate embedding for a single text
  static async generateEmbedding(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    // Clean and truncate text (model has token limit)
    const cleanedText = this.preprocessText(text);

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: cleanedText,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    return response.data[0].embedding;
  }

  // Generate embeddings for multiple texts (batch)
  static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    const cleanedTexts = texts.map((text) => this.preprocessText(text));

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: cleanedTexts,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    return response.data.map((item) => item.embedding);
  }

  // Preprocess text for embedding
  private static preprocessText(text: string): string {
    // Remove excessive whitespace
    let cleaned = text.replace(/\s+/g, " ").trim();

    // Truncate to roughly 8000 tokens (safe limit for embedding model)
    // Approximate: 1 token ~= 4 chars for English
    const maxChars = 32000;
    if (cleaned.length > maxChars) {
      cleaned = cleaned.slice(0, maxChars);
    }

    return cleaned;
  }

  // Prepare text for different entity types
  static prepareQuestionText(title: string, content: string): string {
    return `${title}\n\n${content}`;
  }

  static prepareAnswerText(content: string): string {
    return content;
  }

  static prepareUserText(
    name: string,
    username: string,
    bio?: string | null
  ): string {
    const parts = [name, `@${username}`];
    if (bio) {
      parts.push(bio);
    }
    return parts.join("\n");
  }

  static prepareTagText(name: string): string {
    return name;
  }
}

export const generateEmbedding =
  EmbeddingService.generateEmbedding.bind(EmbeddingService);
export const generateEmbeddings =
  EmbeddingService.generateEmbeddings.bind(EmbeddingService);
