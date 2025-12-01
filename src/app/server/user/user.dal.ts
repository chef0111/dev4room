import "server-only";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { and, or, ilike, desc, asc, sql, eq } from "drizzle-orm";
import { getPagination, validateArray } from "../utils";
import { UsersDTO, UsersSchema, UserQueryParams } from "./user.dto";

type UserFilter = "newest" | "oldest" | "popular";

export class UserDAL {
  private static readonly selectFields = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image,
    role: user.role,
  } as const;

  private static getSortCriteria(filter?: UserFilter) {
    switch (filter) {
      case "newest":
        return desc(user.createdAt);
      case "oldest":
        return asc(user.createdAt);
      case "popular":
        return desc(user.reputation);
      default:
        return asc(user.createdAt);
    }
  }

  private static buildSearchCondition(query?: string) {
    if (!query) return undefined;
    return or(
      ilike(user.name, `%${query}%`),
      ilike(user.username, `%${query}%`),
    );
  }

  static async findMany(
    params: UserQueryParams,
  ): Promise<{ users: UsersDTO[]; totalUsers: number }> {
    const { query, filter } = params;
    const { offset, limit } = getPagination(params);

    // Build where conditions
    const conditions = [
      eq(user.emailVerified, true),
      this.buildSearchCondition(query),
    ].filter(Boolean);

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const sortCriteria = this.getSortCriteria(filter as UserFilter);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(where);

    const rows = await db
      .select(this.selectFields)
      .from(user)
      .where(where)
      .orderBy(sortCriteria)
      .limit(limit)
      .offset(offset);

    const users = validateArray(rows, UsersSchema, "User");

    return { users, totalUsers: count ?? 0 };
  }
}

export const getUsers = UserDAL.findMany.bind(UserDAL);
