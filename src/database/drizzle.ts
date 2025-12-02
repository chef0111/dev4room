import { config } from "dotenv";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import ws from "ws";

config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

// Configure WebSocket
neonConfig.webSocketConstructor = ws;

// HTTP client for simple queries (faster for single queries)
const httpClient = neon(url);
export const dbHttp = drizzleHttp(httpClient, { schema });

// WebSocket pool for transactions
const pool = new Pool({ connectionString: url });
export const db = drizzleWs(pool, { schema });
