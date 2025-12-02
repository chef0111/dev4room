import "server-only";

import { db } from "@/database/drizzle";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
