import "server-only";

import { cacheTag, cacheLife } from "next/cache";

import { db } from "@/database/drizzle";
import { user, question, answer, tagQuestion, tag } from "@/database/schema";
import { and, or, ilike, desc, asc, sql, eq, inArray, not } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { getPagination, validateArray, validateOne } from "../utils";
import { TagQuestionService } from "../tag-question/service";
import { assignBadges } from "@/lib/utils";
import {
  UserDTO,
  UserSchema,
  GetUserOutput,
  GetUserOutputSchema,
  UserPostInput,
  GetUserTagsInput,
  GetUserStatsInput,
  UserQuestionDTO,
  UserQuestionSchema,
  UserAnswerDTO,
  UserAnswerSchema,
  UserPopularTagDTO,
  UserPopularTagSchema,
  UserStatsDTO,
  UpdateProfileInput,
} from "./user.dto";

type UserFilter = "newest" | "oldest" | "popular";

export class UserDAL {
  private static readonly selectFields = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image,
    bio: user.bio,
    location: user.location,
    portfolio: user.portfolio,
    reputation: user.reputation,
    role: user.role,
    createdAt: user.createdAt,
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
      ilike(user.username, `%${query}%`)
    );
  }

  static async findMany(
    params: QueryParams
  ): Promise<{ users: UserDTO[]; totalUsers: number }> {
    const { query, filter } = params;
    const { offset, limit } = getPagination(params);

    // Build where conditions
    const conditions = [
      eq(user.emailVerified, true),
      not(eq(user.banned, true)),
      not(eq(user.role, "admin")),
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

  static async findById(userId: string): Promise<GetUserOutput> {
    "use cache";
    cacheLife({ stale: 120, revalidate: 60, expire: 3600 });
    cacheTag(`user:${userId}`);

    const selectFields = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      bio: user.bio,
      location: user.location,
      portfolio: user.portfolio,
      reputation: user.reputation,
      role: user.role,
      createdAt: user.createdAt,
    };

    const [row] = await db
      .select(selectFields)
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!row) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    // Get counts in parallel
    const [[questionCount], [answerCount]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(question)
        .where(
          and(eq(question.authorId, userId), eq(question.status, "approved"))
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(answer)
        .where(eq(answer.authorId, userId)),
    ]);

    const validatedUser = validateOne(row, UserSchema, "User");

    return validateOne(
      {
        user: validatedUser,
        totalQuestions: questionCount.count ?? 0,
        totalAnswers: answerCount.count ?? 0,
      },
      GetUserOutputSchema,
      "GetUserOutput"
    );
  }

  static async findByUsername(username: string): Promise<GetUserOutput> {
    "use cache";
    cacheLife({ stale: 120, revalidate: 60, expire: 3600 });
    cacheTag(`user:username:${username}`);

    const selectFields = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      bio: user.bio,
      location: user.location,
      portfolio: user.portfolio,
      reputation: user.reputation,
      role: user.role,
      createdAt: user.createdAt,
    };

    const [row] = await db
      .select(selectFields)
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    if (!row) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    // Get counts in parallel
    const [[questionCount], [answerCount]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(question)
        .where(
          and(eq(question.authorId, row.id), eq(question.status, "approved"))
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(answer)
        .where(eq(answer.authorId, row.id)),
    ]);

    const validatedUser = validateOne(row, UserSchema, "User");

    return validateOne(
      {
        user: validatedUser,
        totalQuestions: questionCount.count ?? 0,
        totalAnswers: answerCount.count ?? 0,
      },
      GetUserOutputSchema,
      "GetUserOutput"
    );
  }

  static async findUserQuestions(
    input: UserPostInput
  ): Promise<{ questions: UserQuestionDTO[]; totalQuestions: number }> {
    const { userId, page, pageSize, filter } = input;
    const { offset, limit } = getPagination({ page, pageSize });

    // Verify user exists
    const [userExists] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userExists) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    // Determine sort criteria
    const getSortCriteria = (f?: string) => {
      switch (f as UserFilter) {
        case "newest":
          return desc(question.createdAt);
        case "oldest":
          return asc(question.createdAt);
        case "popular":
          return desc(question.upvotes);
        default:
          return desc(question.upvotes);
      }
    };

    const where = and(
      eq(question.authorId, userId),
      eq(question.status, "approved")
    );

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(question)
      .where(where);

    const rows = await db
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
        views: question.views,
        upvotes: question.upvotes,
        downvotes: question.downvotes,
        answers: question.answers,
        createdAt: question.createdAt,
      })
      .from(question)
      .where(where)
      .orderBy(getSortCriteria(filter))
      .limit(limit)
      .offset(offset);

    // Fetch tags for all questions
    const tagsByQuestion = await TagQuestionService.getTagsQuestions(
      rows.map((r) => r.id)
    );

    const questions = validateArray(
      rows.map((row) => ({
        ...row,
        tags: tagsByQuestion[row.id] ?? [],
      })),
      UserQuestionSchema,
      "UserQuestion"
    );

    return { questions, totalQuestions: count ?? 0 };
  }

  static async findUserAnswers(
    input: UserPostInput
  ): Promise<{ answers: UserAnswerDTO[]; totalAnswers: number }> {
    const { userId, page, pageSize, filter } = input;
    const { offset, limit } = getPagination({ page, pageSize });

    // Verify user exists
    const [userExists] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userExists) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    // Determine sort criteria
    const getSortCriteria = (f?: string) => {
      switch (f as UserFilter) {
        case "newest":
          return desc(answer.createdAt);
        case "oldest":
          return asc(answer.createdAt);
        case "popular":
        default:
          return desc(answer.upvotes);
      }
    };

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(answer)
      .where(eq(answer.authorId, userId));

    const rows = await db
      .select({
        id: answer.id,
        content: answer.content,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
        createdAt: answer.createdAt,
        questionId: question.id,
        questionTitle: question.title,
      })
      .from(answer)
      .innerJoin(question, eq(answer.questionId, question.id))
      .where(eq(answer.authorId, userId))
      .orderBy(getSortCriteria(filter))
      .limit(limit)
      .offset(offset);

    const answers = validateArray(
      rows.map((row) => ({
        id: row.id,
        content: row.content,
        upvotes: row.upvotes,
        downvotes: row.downvotes,
        createdAt: row.createdAt,
        question: {
          id: row.questionId,
          title: row.questionTitle,
        },
      })),
      UserAnswerSchema,
      "UserAnswer"
    );

    return { answers, totalAnswers: count ?? 0 };
  }

  static async findUserPopularTags(
    input: GetUserTagsInput
  ): Promise<{ tags: UserPopularTagDTO[] }> {
    const { userId, limit: tagLimit } = input;

    // Verify user exists
    const [userExists] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userExists) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    // Get user's questions
    const userQuestions = await db
      .select({ id: question.id })
      .from(question)
      .where(eq(question.authorId, userId));

    if (userQuestions.length === 0) {
      return { tags: [] };
    }

    const questionIds = userQuestions.map((q) => q.id);

    // Count tags used across user's questions
    const tagCounts = await db
      .select({
        tagId: tagQuestion.tagId,
        tagName: tag.name,
        count: sql<number>`count(*)::int`,
      })
      .from(tagQuestion)
      .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
      .where(inArray(tagQuestion.questionId, questionIds))
      .groupBy(tagQuestion.tagId, tag.name)
      .orderBy(desc(sql`count(*)`))
      .limit(tagLimit);

    const tags = validateArray(
      tagCounts.map((t) => ({
        id: t.tagId,
        name: t.tagName,
        count: t.count,
      })),
      UserPopularTagSchema,
      "UserPopularTag"
    );

    return { tags };
  }

  static async getUserStats(input: GetUserStatsInput): Promise<UserStatsDTO> {
    "use cache";
    cacheLife({ stale: 180, revalidate: 90, expire: 3600 });
    cacheTag(`user:${input.userId}`);

    const { userId } = input;

    // Verify user exists
    const [userExists] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userExists) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    const [[questionStats], [answerStats]] = await Promise.all([
      db
        .select({
          count: sql<number>`count(*)::int`,
          upvotes: sql<number>`coalesce(sum(${question.upvotes}), 0)::int`,
          views: sql<number>`coalesce(sum(${question.views}), 0)::int`,
        })
        .from(question)
        .where(
          and(eq(question.authorId, userId), eq(question.status, "approved"))
        ),
      db
        .select({
          count: sql<number>`count(*)::int`,
          upvotes: sql<number>`coalesce(sum(${answer.upvotes}), 0)::int`,
        })
        .from(answer)
        .where(eq(answer.authorId, userId)),
    ]);

    const badges = assignBadges({
      criteria: [
        { type: "QUESTION_COUNT", count: questionStats.count ?? 0 },
        { type: "ANSWER_COUNT", count: answerStats.count ?? 0 },
        { type: "QUESTION_UPVOTES", count: questionStats.upvotes ?? 0 },
        { type: "ANSWER_UPVOTES", count: answerStats.upvotes ?? 0 },
        { type: "TOTAL_VIEWS", count: questionStats.views ?? 0 },
      ],
    });

    return {
      totalQuestions: questionStats.count ?? 0,
      totalAnswers: answerStats.count ?? 0,
      totalUpvotes: (questionStats.upvotes ?? 0) + (answerStats.upvotes ?? 0),
      totalViews: questionStats.views ?? 0,
      badges,
    };
  }

  static async update(
    userId: string,
    data: UpdateProfileInput
  ): Promise<UserDTO> {
    if (data.username) {
      const existing = await db
        .select({ id: user.id })
        .from(user)
        .where(
          and(eq(user.username, data.username), sql`${user.id} != ${userId}`)
        )
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
        portfolio: user.portfolio,
        reputation: user.reputation,
        createdAt: user.createdAt,
      });

    if (!updated) {
      throw new Error("User not found");
    }

    const validated = UserSchema.safeParse(updated);
    if (!validated.success) {
      throw new Error("Failed to validate updated profile");
    }

    return validated.data;
  }
}

export const getUsers = (...args: Parameters<typeof UserDAL.findMany>) =>
  UserDAL.findMany(...args);
export const getUserById = (...args: Parameters<typeof UserDAL.findById>) =>
  UserDAL.findById(...args);
export const getUserByUsername = (
  ...args: Parameters<typeof UserDAL.findByUsername>
) => UserDAL.findByUsername(...args);
export const getUserQuestions = (
  ...args: Parameters<typeof UserDAL.findUserQuestions>
) => UserDAL.findUserQuestions(...args);
export const getUserAnswers = (
  ...args: Parameters<typeof UserDAL.findUserAnswers>
) => UserDAL.findUserAnswers(...args);
export const getUserPopularTags = (
  ...args: Parameters<typeof UserDAL.findUserPopularTags>
) => UserDAL.findUserPopularTags(...args);
export const getUserStats = (
  ...args: Parameters<typeof UserDAL.getUserStats>
) => UserDAL.getUserStats(...args);
export const updateUser = (...args: Parameters<typeof UserDAL.update>) =>
  UserDAL.update(...args);
