import "server-only";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { UsersDTO, UsersSchema } from "./user.dto";
import { and, or, ilike, desc, asc, sql, SQL } from "drizzle-orm";

export async function getUsers(
  params: QueryParams,
): Promise<{ users: UsersDTO[]; totalUsers: number }> {
  const { page = 1, pageSize = 10, query, filter } = params;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Build where conditions
  const conditions: (SQL<unknown> | undefined)[] = [];

  if (query) {
    conditions.push(
      or(ilike(user.name, `%${query}%`), ilike(user.username, `%${query}%`)),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Determine sort criteria
  let sortCriteria;
  switch (filter) {
    case "newest":
      sortCriteria = desc(user.createdAt);
      break;
    case "oldest":
      sortCriteria = asc(user.createdAt);
      break;
    case "popular":
      sortCriteria = desc(user.reputation);
      break;
    default:
      sortCriteria = asc(user.createdAt);
  }

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(where);

  const totalUsers = countResult?.count ?? 0;

  // Get paginated results
  const results = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
    })
    .from(user)
    .where(where)
    .orderBy(sortCriteria)
    .limit(limit)
    .offset(offset);

  const users = results;

  // Validate and return users
  const validatedUsers = users
    .map((user) => {
      const result = UsersSchema.safeParse(user);

      if (!result.success) {
        console.error("User validation failed:", result.error);
        return null;
      }
      return result.data;
    })
    .filter((user): user is UsersDTO => user !== null);

  return { users: validatedUsers, totalUsers };
}
