import "server-only";
import { db } from "@/database/drizzle";
import {
  user,
  answer,
  tag,
  interaction,
  tagQuestion,
  question,
} from "@/database/schema";
import { count, gte, eq, and, lt, desc, sql, inArray, or } from "drizzle-orm";

export interface PlatformStatsResult {
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  totalTags: number;
  todayStats: {
    newUsers: number;
    newQuestions: number;
    newAnswers: number;
    totalInteractions: number;
  };
  growthRates: {
    usersGrowth: number;
    questionsGrowth: number;
    answersGrowth: number;
  };
}

export interface UserListItem {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  reputation: number;
  questionCount: number;
  answerCount: number;
  createdAt: Date;
}

export class AdminDAL {
  private static calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  static async getPlatformStats(): Promise<PlatformStatsResult> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      users,
      questions,
      answers,
      tags,
      newUsersToday,
      newQuestionsToday,
      newAnswersToday,
      interactionsToday,
      usersThisWeek,
      usersLastWeek,
      questionsThisWeek,
      questionsLastWeek,
      answersThisWeek,
      answersLastWeek,
    ] = await Promise.all([
      // Total counts
      db.select({ count: count() }).from(user),
      db.select({ count: count() }).from(question),
      db.select({ count: count() }).from(answer),
      db.select({ count: count() }).from(tag),

      // Today's activity
      db
        .select({ count: count() })
        .from(user)
        .where(gte(user.createdAt, today)),
      db
        .select({ count: count() })
        .from(question)
        .where(
          and(gte(question.createdAt, today), eq(question.status, "approved"))
        ),
      db
        .select({ count: count() })
        .from(answer)
        .where(gte(answer.createdAt, today)),
      db
        .select({ count: count() })
        .from(interaction)
        .where(gte(interaction.createdAt, today)),

      // Growth calculations - this week
      db
        .select({ count: count() })
        .from(user)
        .where(gte(user.createdAt, lastWeek)),
      // Last week
      db
        .select({ count: count() })
        .from(user)
        .where(
          and(gte(user.createdAt, twoWeeksAgo), lt(user.createdAt, lastWeek))
        ),
      db
        .select({ count: count() })
        .from(question)
        .where(
          and(
            gte(question.createdAt, lastWeek),
            eq(question.status, "approved")
          )
        ),
      db
        .select({ count: count() })
        .from(question)
        .where(
          and(
            gte(question.createdAt, twoWeeksAgo),
            eq(question.status, "approved"),
            lt(question.createdAt, lastWeek)
          )
        ),
      db
        .select({ count: count() })
        .from(answer)
        .where(gte(answer.createdAt, lastWeek)),
      db
        .select({ count: count() })
        .from(answer)
        .where(
          and(
            gte(answer.createdAt, twoWeeksAgo),
            lt(answer.createdAt, lastWeek)
          )
        ),
    ]);

    return {
      totalUsers: users[0]?.count ?? 0,
      totalQuestions: questions[0]?.count ?? 0,
      totalAnswers: answers[0]?.count ?? 0,
      totalTags: tags[0]?.count ?? 0,
      todayStats: {
        newUsers: newUsersToday[0]?.count ?? 0,
        newQuestions: newQuestionsToday[0]?.count ?? 0,
        newAnswers: newAnswersToday[0]?.count ?? 0,
        totalInteractions: interactionsToday[0]?.count ?? 0,
      },
      growthRates: {
        usersGrowth: this.calculateGrowth(
          usersThisWeek[0]?.count ?? 0,
          usersLastWeek[0]?.count ?? 0
        ),
        questionsGrowth: this.calculateGrowth(
          questionsThisWeek[0]?.count ?? 0,
          questionsLastWeek[0]?.count ?? 0
        ),
        answersGrowth: this.calculateGrowth(
          answersThisWeek[0]?.count ?? 0,
          answersLastWeek[0]?.count ?? 0
        ),
      },
    };
  }

  static async getUsers(params: {
    search?: string;
    role?: string;
    banned?: boolean;
    emailVerified?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    limit: number;
    offset: number;
  }): Promise<{ users: UserListItem[]; total: number }> {
    const conditions = [];

    // Search by name or email
    if (params.search) {
      const searchPattern = `%${params.search}%`;
      conditions.push(
        or(
          sql`${user.name} ILIKE ${searchPattern}`,
          sql`${user.email} ILIKE ${searchPattern}`
        )
      );
    }

    if (params.role) {
      conditions.push(eq(user.role, params.role));
    }

    if (params.banned !== undefined) {
      conditions.push(eq(user.banned, params.banned));
    }

    if (params.emailVerified !== undefined) {
      conditions.push(eq(user.emailVerified, params.emailVerified));
    }

    if (params.createdAfter) {
      conditions.push(gte(user.createdAt, params.createdAfter));
    }

    if (params.createdBefore) {
      conditions.push(lt(user.createdAt, params.createdBefore));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(user)
      .where(whereClause);

    // Get paginated users
    const rawUsers = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        reputation: user.reputation,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(params.limit)
      .offset(params.offset);

    const users = await this.appendFields(rawUsers);

    return {
      users,
      total: countResult?.count ?? 0,
    };
  }

  static async appendFields(
    users: Array<{
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      role?: string | null;
      banned?: boolean | null;
      banReason?: string | null;
      createdAt: Date;
    }>
  ): Promise<UserListItem[]> {
    if (users.length === 0) return [];

    const userIds = users.map((u) => u.id);

    const field = await db
      .select({
        id: user.id,
        username: user.username,
        reputation: user.reputation,
        questionCount: sql<number>`(SELECT COUNT(*)::int FROM "question" WHERE "question"."author_id" = "user"."id" AND "question"."status" = 'approved')`,
        answerCount: sql<number>`(SELECT COUNT(*)::int FROM "answer" WHERE "answer"."author_id" = "user"."id")`,
      })
      .from(user)
      .where(inArray(user.id, userIds));

    const fieldMap = new Map(field.map((d) => [d.id, d]));

    return users.map((u) => {
      const extra = fieldMap.get(u.id);
      return {
        id: u.id,
        name: u.name,
        username: extra?.username ?? "",
        email: u.email,
        emailVerified: u.emailVerified,
        role: u.role ?? null,
        banned: u.banned ?? null,
        banReason: u.banReason ?? null,
        reputation: extra?.reputation ?? 0,
        questionCount: extra?.questionCount ?? 0,
        answerCount: extra?.answerCount ?? 0,
        createdAt: u.createdAt,
      };
    });
  }

  static async getGrowthAnalytics(days: number = 90): Promise<
    Array<{
      date: string;
      questions: number;
      answers: number;
    }>
  > {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get daily question counts
    const questionsData = await db
      .select({
        date: sql<string>`DATE(${question.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)::int`.as("count"),
      })
      .from(question)
      .where(
        and(
          gte(question.createdAt, startDate),
          lt(question.createdAt, endDate),
          eq(question.status, "approved")
        )
      )
      .groupBy(sql`DATE(${question.createdAt})`)
      .orderBy(sql`DATE(${question.createdAt})`);

    // Get daily answer counts
    const answersData = await db
      .select({
        date: sql<string>`DATE(${answer.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)::int`.as("count"),
      })
      .from(answer)
      .where(
        and(gte(answer.createdAt, startDate), lt(answer.createdAt, endDate))
      )
      .groupBy(sql`DATE(${answer.createdAt})`)
      .orderBy(sql`DATE(${answer.createdAt})`);

    const dateMap = new Map<
      string,
      { date: string; questions: number; answers: number }
    >();

    // Initialize all dates with 0 counts
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dateMap.set(dateStr, { date: dateStr, questions: 0, answers: 0 });
    }

    // Fill in question counts
    questionsData.forEach((row) => {
      const existing = dateMap.get(row.date);
      if (existing) {
        existing.questions = row.count;
      }
    });

    // Fill in answer counts
    answersData.forEach((row) => {
      const existing = dateMap.get(row.date);
      if (existing) {
        existing.answers = row.count;
      }
    });

    return Array.from(dateMap.values());
  }

  static async getPendingQuestions(params: {
    search?: string;
    status?: "pending" | "rejected";
    limit: number;
    offset: number;
  }): Promise<{
    questions: Array<{
      id: string;
      title: string;
      content: string;
      status: "pending" | "approved" | "rejected";
      rejectReason: string | null;
      createdAt: Date;
      author: {
        id: string;
        name: string;
        username: string;
        image: string | null;
      };
      tags: { id: string; name: string }[];
    }>;
    total: number;
  }> {
    const conditions = [];

    // Filter by status
    if (params.status) {
      conditions.push(eq(question.status, params.status));
    } else {
      conditions.push(
        or(eq(question.status, "pending"), eq(question.status, "rejected"))
      );
    }

    // Search by title or author name
    if (params.search) {
      const searchPattern = `%${params.search}%`;
      conditions.push(
        or(
          sql`${question.title} ILIKE ${searchPattern}`,
          sql`${user.name} ILIKE ${searchPattern}`
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await db
      .select({ count: count() })
      .from(question)
      .leftJoin(user, eq(question.authorId, user.id))
      .where(whereClause);

    // Get paginated questions
    const rows = await db
      .select({
        id: question.id,
        title: question.title,
        content: question.content,
        status: question.status,
        rejectReason: question.rejectReason,
        createdAt: question.createdAt,
        authorId: question.authorId,
        authorName: user.name,
        authorUsername: user.username,
        authorImage: user.image,
      })
      .from(question)
      .leftJoin(user, eq(question.authorId, user.id))
      .where(whereClause)
      .orderBy(desc(question.createdAt))
      .limit(params.limit)
      .offset(params.offset);

    // Get tags for each question
    const questionIds = rows.map((r) => r.id);
    const tagData =
      questionIds.length > 0
        ? await db
            .select({
              questionId: tagQuestion.questionId,
              tagId: tag.id,
              tagName: tag.name,
            })
            .from(tagQuestion)
            .innerJoin(tag, eq(tagQuestion.tagId, tag.id))
            .where(inArray(tagQuestion.questionId, questionIds))
        : [];

    // Group tags by question
    const tagsByQuestion = new Map<string, { id: string; name: string }[]>();
    tagData.forEach((row) => {
      if (!tagsByQuestion.has(row.questionId)) {
        tagsByQuestion.set(row.questionId, []);
      }
      tagsByQuestion.get(row.questionId)!.push({
        id: row.tagId,
        name: row.tagName,
      });
    });

    return {
      questions: rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        status: row.status as "pending" | "approved" | "rejected",
        rejectReason: row.rejectReason,
        createdAt: row.createdAt,
        author: {
          id: row.authorId,
          name: row.authorName ?? "Unknown",
          username: row.authorUsername ?? "unknown",
          image: row.authorImage,
        },
        tags: tagsByQuestion.get(row.id) ?? [],
      })),
      total: countResult?.count ?? 0,
    };
  }

  static async approveQuestion(questionId: string): Promise<void> {
    const [existing] = await db
      .select({ id: question.id, status: question.status })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!existing) {
      throw new Error("Question not found");
    }

    if (existing.status !== "pending") {
      throw new Error("Question is not pending");
    }

    // Update question status
    await db
      .update(question)
      .set({ status: "approved" })
      .where(eq(question.id, questionId));

    // Update associated tags to approved status
    const questionTags = await db
      .select({ tagId: tagQuestion.tagId })
      .from(tagQuestion)
      .where(eq(tagQuestion.questionId, questionId));

    if (questionTags.length > 0) {
      const tagIds = questionTags.map((t) => t.tagId);
      await db
        .update(tag)
        .set({ status: "approved" })
        .where(and(inArray(tag.id, tagIds), eq(tag.status, "pending")));
    }
  }

  static async rejectQuestion(
    questionId: string,
    reason: string
  ): Promise<void> {
    const [existing] = await db
      .select({ id: question.id, status: question.status })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!existing) {
      throw new Error("Question not found");
    }

    if (existing.status !== "pending") {
      throw new Error("Question is not pending");
    }

    await db
      .update(question)
      .set({ status: "rejected", rejectReason: reason })
      .where(eq(question.id, questionId));
  }
}

export const getPlatformStats = () => AdminDAL.getPlatformStats();
export const appendFields = (
  ...args: Parameters<typeof AdminDAL.appendFields>
) => AdminDAL.appendFields(...args);
export const getGrowthAnalytics = (
  ...args: Parameters<typeof AdminDAL.getGrowthAnalytics>
) => AdminDAL.getGrowthAnalytics(...args);
export const getPendingQuestions = (
  ...args: Parameters<typeof AdminDAL.getPendingQuestions>
) => AdminDAL.getPendingQuestions(...args);
export const approveQuestion = (
  ...args: Parameters<typeof AdminDAL.approveQuestion>
) => AdminDAL.approveQuestion(...args);
export const rejectQuestion = (
  ...args: Parameters<typeof AdminDAL.rejectQuestion>
) => AdminDAL.rejectQuestion(...args);
export const getUsers = (...args: Parameters<typeof AdminDAL.getUsers>) =>
  AdminDAL.getUsers(...args);
