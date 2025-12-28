import { z } from "zod";

// ============= Platform Stats DTOs =============
export const TodayStatsSchema = z.object({
  newUsers: z.number().int().nonnegative(),
  newQuestions: z.number().int().nonnegative(),
  newAnswers: z.number().int().nonnegative(),
  totalInteractions: z.number().int().nonnegative(),
});

export const GrowthRatesSchema = z.object({
  usersGrowth: z.number(),
  questionsGrowth: z.number(),
  answersGrowth: z.number(),
});

export const PlatformStatsSchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  totalQuestions: z.number().int().nonnegative(),
  totalAnswers: z.number().int().nonnegative(),
  totalTags: z.number().int().nonnegative(),
  todayStats: TodayStatsSchema,
  growthRates: GrowthRatesSchema,
});

export type PlatformStats = z.infer<typeof PlatformStatsSchema>;

// ============= User Management DTOs =============
export const ListUsersInputSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  banned: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export const UserListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  role: z.string().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  reputation: z.number().int(),
  questionCount: z.number().int().nonnegative(),
  answerCount: z.number().int().nonnegative(),
  createdAt: z.date(),
});

export const ListUsersOutputSchema = z.object({
  users: z.array(UserListItemSchema),
  total: z.number().int().nonnegative(),
});

export const BanUserInputSchema = z.object({
  userId: z.string(),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

export const UnbanUserInputSchema = z.object({
  userId: z.string(),
});

export const UpdateUserRoleInputSchema = z.object({
  userId: z.string(),
  role: z.enum(["admin", "user"]).nullable(),
});

export const DeleteUserInputSchema = z.object({
  userId: z.string(),
});

export const GrowthAnalyticsInputSchema = z.object({
  days: z.number().int().min(1).max(365).default(90),
});

export const GrowthDataPointSchema = z.object({
  date: z.string(),
  questions: z.number().int().nonnegative(),
  answers: z.number().int().nonnegative(),
});

export const GrowthAnalyticsOutputSchema = z.object({
  data: z.array(GrowthDataPointSchema),
});

// ============= Pending Questions DTOs =============
export const ListPendingQuestionsInputSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "rejected"]).optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().nonnegative().default(0),
});

export const PendingQuestionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  rejectReason: z.string().nullable(),
  createdAt: z.date(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string().nullable(),
  }),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
});

export const ListPendingQuestionsOutputSchema = z.object({
  questions: z.array(PendingQuestionItemSchema),
  total: z.number().int().nonnegative(),
});
