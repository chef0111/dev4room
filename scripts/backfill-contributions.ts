/**
 * Script to backfill the contribution table with existing approved questions, answers, and tags
 *
 * Run with: npx tsx scripts/backfill-contributions.ts
 */

import { config } from "dotenv";
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function backfillQuestions(): Promise<number> {
  const result = await sql`
    INSERT INTO contribution (id, user_id, type, reference_id, created_at)
    SELECT 
      gen_random_uuid()::text,
      author_id,
      'question',
      id,
      created_at
    FROM question q
    WHERE NOT EXISTS (
      SELECT 1 FROM contribution c 
      WHERE c.reference_id = q.id AND c.type = 'question'
    )
    RETURNING id
  `;

  return result.length;
}

async function backfillAnswers(): Promise<number> {
  const result = await sql`
    INSERT INTO contribution (id, user_id, type, reference_id, created_at)
    SELECT 
      gen_random_uuid()::text,
      author_id,
      'answer',
      id,
      created_at
    FROM answer a
    WHERE NOT EXISTS (
      SELECT 1 FROM contribution c 
      WHERE c.reference_id = a.id AND c.type = 'answer'
    )
    RETURNING id
  `;

  return result.length;
}

async function backfillTags(): Promise<number> {
  const result = await sql`
    INSERT INTO contribution (id, user_id, type, reference_id, created_at)
    SELECT DISTINCT ON (tq.tag_id)
      gen_random_uuid()::text,
      q.author_id,
      'tag',
      tq.tag_id,
      tq.created_at
    FROM tag_question tq
    INNER JOIN question q ON tq.question_id = q.id
    WHERE NOT EXISTS (
      SELECT 1 FROM contribution c 
      WHERE c.reference_id = tq.tag_id AND c.type = 'tag'
    )
    ORDER BY tq.tag_id, tq.created_at ASC
    RETURNING id
  `;

  return result.length;
}

async function main() {
  console.log("Starting contribution backfill...\n");

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not set in .env");
    process.exit(1);
  }

  try {
    console.log("Backfilling questions...");
    const questionCount = await backfillQuestions();
    console.log(`  ${questionCount} question contributions added`);

    console.log("Backfilling answers...");
    const answerCount = await backfillAnswers();
    console.log(`  ${answerCount} answer contributions added`);

    console.log("Backfilling tags...");
    const tagCount = await backfillTags();
    console.log(`  ${tagCount} tag contributions added`);

    console.log("\nBackfill complete!");
    console.log(
      `Total: ${questionCount + answerCount + tagCount} contributions`
    );
  } catch (error) {
    console.error("Error during backfill:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
