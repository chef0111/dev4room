"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { cacheLife, cacheTag } from "next/cache";

export async function getServerSession() {
  "use cache: private";
  cacheTag("user-session");
  cacheLife({
    stale: 60, // 1 minute until considered stale
    revalidate: 300, // 5 minutes until revalidated
    expire: 3600, // 1 hour until expired
  });

  return await auth.api.getSession({ headers: await headers() });
}
