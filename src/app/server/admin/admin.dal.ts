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
import {
  count,
  gte,
  eq,
  and,
  lt,
  like,
  or,
  desc,
  sql,
  inArray,
} from "drizzle-orm";

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
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  reputation: number;
  questionCount: number;
  answerCount: number;
  createdAt: Date;
}

export interface ListUsersParams {
  search?: string;
  role?: string;
  banned?: boolean;
  limit: number;
  offset: number;
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
        .where(gte(question.createdAt, today)),
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
        .where(gte(question.createdAt, lastWeek)),
      db
        .select({ count: count() })
        .from(question)
        .where(
          and(
            gte(question.createdAt, twoWeeksAgo),
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

  static async listAllUsers(
    params: ListUsersParams
  ): Promise<{ users: UserListItem[]; total: number }> {
    const conditions = [];

    if (params.search) {
      conditions.push(
        or(
          like(user.name, `%${params.search}%`),
          like(user.email, `%${params.search}%`),
          like(user.username, `%${params.search}%`)
        )
      );
    }

    if (params.role) {
      if (params.role === "user") {
        conditions.push(or(eq(user.role, "user"), sql`${user.role} IS NULL`));
      } else {
        conditions.push(eq(user.role, params.role));
      }
    }

    if (params.banned !== undefined) {
      conditions.push(eq(user.banned, params.banned));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [usersData, totalCount] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          banned: user.banned,
          banReason: user.banReason,
          reputation: user.reputation,
          questionCount: sql<number>`(SELECT COUNT(*)::int FROM "question" WHERE "question"."author_id" = "user"."id" AND "question"."status" != 'pending')`,
          answerCount: sql<number>`(SELECT COUNT(*)::int FROM "answer" WHERE "answer"."author_id" = "user"."id")`,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(where)
        .orderBy(desc(user.createdAt))
        .limit(params.limit)
        .offset(params.offset),
      db.select({ count: count() }).from(user).where(where),
    ]);

    return {
      users: usersData,
      total: totalCount[0]?.count ?? 0,
    };
  }

  static async banUserById(userId: string, reason: string): Promise<void> {
    await db
      .update(user)
      .set({
        banned: true,
        banReason: reason,
        role: null,
      })
      .where(eq(user.id, userId));
  }

  static async unbanUserById(userId: string): Promise<void> {
    await db
      .update(user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
      })
      .where(eq(user.id, userId));
  }

  static async updateUserRole(
    userId: string,
    role: string | null
  ): Promise<void> {
    await db.update(user).set({ role }).where(eq(user.id, userId));
  }

  static async deleteUserById(userId: string): Promise<void> {
    await db.delete(user).where(eq(user.id, userId));
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
        and(gte(question.createdAt, startDate), lt(question.createdAt, endDate))
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

  static async getPendingQuestions() {
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
      .where(
        or(eq(question.status, "pending"), eq(question.status, "rejected"))
      )
      .orderBy(desc(question.createdAt));

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

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      status: row.status,
      rejectReason: row.rejectReason,
      createdAt: row.createdAt,
      author: {
        id: row.authorId,
        name: row.authorName ?? "Unknown",
        username: row.authorUsername ?? "unknown",
        image: row.authorImage,
      },
      tags: tagsByQuestion.get(row.id) ?? [],
    }));
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

    await db
      .update(question)
      .set({ status: "approved" })
      .where(eq(question.id, questionId));
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

export const getPlatformStats = AdminDAL.getPlatformStats.bind(AdminDAL);
export const listAllUsers = AdminDAL.listAllUsers.bind(AdminDAL);
export const banUserById = AdminDAL.banUserById.bind(AdminDAL);
export const unbanUserById = AdminDAL.unbanUserById.bind(AdminDAL);
export const updateUserRole = AdminDAL.updateUserRole.bind(AdminDAL);
export const deleteUserById = AdminDAL.deleteUserById.bind(AdminDAL);
export const getGrowthAnalytics = AdminDAL.getGrowthAnalytics.bind(AdminDAL);
export const getPendingQuestions = AdminDAL.getPendingQuestions.bind(AdminDAL);
export const approveQuestion = AdminDAL.approveQuestion.bind(AdminDAL);
export const rejectQuestion = AdminDAL.rejectQuestion.bind(AdminDAL);
