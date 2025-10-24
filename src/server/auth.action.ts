import { db } from "@/database/drizzle";
import { schema } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function checkUserExists(email: string) {
  return await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, email),
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
