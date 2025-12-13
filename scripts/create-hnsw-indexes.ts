import { config } from "dotenv";
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log(
    "Creating HNSW indexes (more memory-efficient than IVFFlat)...\n",
  );

  try {
    console.log("1. Creating user_embedding_idx...");
    await sql`CREATE INDEX IF NOT EXISTS user_embedding_idx ON "user" USING hnsw (embedding vector_cosine_ops)`;
    console.log("   Done!");

    console.log("2. Creating tag_embedding_idx...");
    await sql`CREATE INDEX IF NOT EXISTS tag_embedding_idx ON tag USING hnsw (embedding vector_cosine_ops)`;
    console.log("   Done!");

    console.log("3. Creating question_embedding_idx...");
    await sql`CREATE INDEX IF NOT EXISTS question_embedding_idx ON question USING hnsw (embedding vector_cosine_ops)`;
    console.log("   Done!");

    console.log("4. Creating answer_embedding_idx...");
    await sql`CREATE INDEX IF NOT EXISTS answer_embedding_idx ON answer USING hnsw (embedding vector_cosine_ops)`;
    console.log("   Done!\n");

    console.log("✓ All HNSW indexes created successfully!");
    console.log(
      "\nHNSW indexes are better for small-to-medium datasets and use less memory.",
    );
  } catch (error) {
    console.error("Failed to create indexes:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
