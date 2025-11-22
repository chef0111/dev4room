"use server";

import { db } from "@/database/drizzle";
import { schema } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function checkUserExists(email: string) {
  return await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
}

export async function checkExistingUsername(username: string) {
  return await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });
}

export async function checkUserCredentials(userId: string) {
  return await db.query.account.findFirst({
    where: (accounts, { and, eq }) =>
      and(eq(accounts.userId, userId), eq(accounts.providerId, "credential")),
  });
}

export async function verifyUserEmail(email: string) {
  return await db
    .update(schema.user)
    .set({ emailVerified: true })
    .where(eq(schema.user.email, email));
}

function generateRandomUsername(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

  // Generate random alphanumeric suffix
  const randomSuffix = Math.random().toString(36).substring(2, 8).toLowerCase();

  return `${cleanName}_${randomSuffix}`;
}

export async function generateUniqueUsername(
  baseName: string,
): Promise<string> {
  let username = generateRandomUsername(baseName);
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.username, username),
    });

    if (!existingUser) {
      return username;
    }

    // If username exists, generate a new one
    username = generateRandomUsername(baseName);
    attempts++;
  }

  // If still not unique after max attempts, add timestamp
  return `${generateRandomUsername(baseName)}_${Date.now().toString(36)}`;
}
