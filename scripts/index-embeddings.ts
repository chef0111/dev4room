/**
 * Script to generate embeddings for existing data
 *
 * Run with: npx tsx scripts/index-embeddings.ts
 *
 * Prerequisites:
 * 1. Set OPENAI_API_KEY in .env
 * 2. Run the migration to add embedding columns
 */

import { config } from "dotenv";
config({ path: ".env" });

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL!);

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-large";
const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS ?? 2000);

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
    dimensions: EMBEDDING_DIMENSIONS,
  });

  return response.data.map((item) => item.embedding);
}

function formatVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

async function indexQuestions(): Promise<number> {
  const questions = await sql`
    SELECT id, title, content FROM question WHERE embedding IS NULL
  `;

  if (questions.length === 0) return 0;

  const batchSize = 10;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const texts = batch.map((q) => `${q.title}\n\n${q.content}`);
    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      await sql`
        UPDATE question SET embedding = ${formatVector(embeddings[j])}::vector
        WHERE id = ${batch[j].id}
      `;
    }

    if (i + batchSize < questions.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return questions.length;
}

async function indexAnswers(): Promise<number> {
  const answers = await sql`
    SELECT id, content FROM answer WHERE embedding IS NULL
  `;

  if (answers.length === 0) return 0;

  const batchSize = 10;
  for (let i = 0; i < answers.length; i += batchSize) {
    const batch = answers.slice(i, i + batchSize);
    const texts = batch.map((a) => a.content);
    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      await sql`
        UPDATE answer SET embedding = ${formatVector(embeddings[j])}::vector
        WHERE id = ${batch[j].id}
      `;
    }

    if (i + batchSize < answers.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return answers.length;
}

async function indexTags(): Promise<number> {
  const tags = await sql`
    SELECT id, name FROM tag WHERE embedding IS NULL
  `;

  if (tags.length === 0) return 0;

  const batchSize = 20;
  for (let i = 0; i < tags.length; i += batchSize) {
    const batch = tags.slice(i, i + batchSize);
    const texts = batch.map((t) => t.name);
    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      await sql`
        UPDATE tag SET embedding = ${formatVector(embeddings[j])}::vector
        WHERE id = ${batch[j].id}
      `;
    }

    if (i + batchSize < tags.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return tags.length;
}

async function indexUsers(): Promise<number> {
  const users = await sql`
    SELECT id, name, username, bio FROM "user" WHERE embedding IS NULL
  `;

  if (users.length === 0) return 0;

  const batchSize = 10;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const texts = batch.map((u) => {
      const parts = [u.name, `@${u.username}`];
      if (u.bio) parts.push(u.bio);
      return parts.join("\n");
    });
    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      await sql`
        UPDATE "user" SET embedding = ${formatVector(embeddings[j])}::vector
        WHERE id = ${batch[j].id}
      `;
    }

    if (i + batchSize < users.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return users.length;
}

async function main() {
  console.log("Starting embedding generation...\n");

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in .env");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not set in .env");
    process.exit(1);
  }

  try {
    console.log("Indexing questions...");
    const questionCount = await indexQuestions();
    console.log(`  ${questionCount} questions indexed`);

    console.log("Indexing answers...");
    const answerCount = await indexAnswers();
    console.log(`  ${answerCount} answers indexed`);

    console.log("Indexing tags...");
    const tagCount = await indexTags();
    console.log(`  ${tagCount} tags indexed`);

    console.log("Indexing users...");
    const userCount = await indexUsers();
    console.log(`  ${userCount} users indexed`);

    console.log("\nIndexing complete!");
    console.log(
      `Total: ${questionCount + answerCount + tagCount + userCount} entities`,
    );
  } catch (error) {
    console.error("Error during indexing:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
