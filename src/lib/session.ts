"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Cached server session fetcher using "use cache: private"
 * Allows caching with runtime APIs like headers()
 * Cache is personalized per user session
 */
export async function getCachedServerSession() {
  "use cache: private";
  cacheTag("user-session");
  cacheLife({
    stale: 60, // 1 minute until considered stale
    revalidate: 300, // 5 minutes until revalidated
    expire: 3600, // 1 hour until expired
  });

  return await auth.api.getSession({ headers: await headers() });
}

/**
 * Original uncached version for backwards compatibility
 */
export async function getServerSession() {
  return await auth.api.getSession({ headers: await headers() });
}
