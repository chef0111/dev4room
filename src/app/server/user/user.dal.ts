import "server-only";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { and, or, ilike, desc, asc, sql, eq } from "drizzle-orm";
import { getPagination, validateArray } from "../utils";
import { 
  UserDTO, 
  UserSchema, 
  UserProfileDTO, 
  UserProfileSchema, 
  UpdateProfileInput,
  UpdateProfileOutput } from "./user.dto";
import { User, Users } from "lucide-react";
import { use } from "react";

// Search users 
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
    params: QueryParams,
  ): Promise<{ users: UserDTO[]; totalUsers: number }> {
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

    const users = validateArray(rows, UserSchema, "User");

    return { users, totalUsers: count ?? 0 };
  }

  static async findById(userId: string): Promise<UserProfileDTO | null> {
    const [row] = await db 
    .select({
      id: user.id, 
      name: user.name,
      username: user.username, 
      email: user.email, 
      image: user.image,
      role: user.role, 
      bio: user.bio,
      location: user.location,
      portfolio: user.portfolio, 
      reputation: user.reputation, 
      createdAt: user.createdAt, 
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  
  if (!row) return null; 
  
  const validated = UserProfileSchema.safeParse(row); 
  if (!validated.success) {
    throw new Error("Failed to validate user profile");
  }
  return validated.data; 
  }
  
  static async updateProfile(
    userId: string, 
    data: UpdateProfileInput,
  ): Promise<UserProfileDTO> {
    
    // check if username being updated and if it's already taken
    if (data.username) {
      const existing = await db 
        .select({ id: user.id })
        .from(user)
        .where(and(eq(user.username, data.username), sql`${user.id} != ${userId}`))
        .limit(1); 
      
      if (existing.length > 0) {
        throw new Error("Username already taken");
      }
    }

    // Update user profile
    const [updated] = await db 
      .update(user)
      .set({
        ...data, 
        updatedAt: new Date(), 
      })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        name: user.name, 
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        bio: user.bio,
        location: user.location, 
        portfolio: user.location, 
        reputation: user.reputation, 
        createdAt: user.createdAt, 
      });
    
    if (!updated) {
      throw new Error("User not found"); 
    }

    const validated = UserProfileSchema.safeParse(updated); 
    if (!validated.success) {
      throw new Error("Failed to validate updated profile"); 
    }

    return validated.data; 
  }
}

export const getUsers = UserDAL.findMany.bind(UserDAL);
export const getUserById = UserDAL.findById.bind(UserDAL); 
export const updateUserProfile = UserDAL.updateProfile.bind(UserDAL);