import "server-only";
import z from "zod";
import { TagSchema } from "../question/question.dto";
import { QueryParamsSchema, UsernameSchema } from "@/lib/validations";

// Base User Schema
export const UserSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." }),
  email: z.email({ message: "Invalid email address." }),
  image: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  portfolio: z.string().nullable(),
  reputation: z.number().int().min(0),
  role: z.string().nullable(),
  createdAt: z.date(),
});

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  image: z.string().nullable(),
});

// Input Schemas
export const GetUserSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
});

export const UserPostSchema = QueryParamsSchema.omit({
  query: true,
}).extend({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const GetUserTagsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  limit: z.number().int().min(1).max(20).default(10),
});

export const GetUserStatsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const GetUserContributionsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  year: z.number().int().min(2000).max(2100),
});

export const ContributionActivitySchema = z.object({
  date: z.string(),
  count: z.number().int().min(0),
  level: z.number().int().min(0).max(4),
});

export const UserContributionsOutputSchema = z.object({
  timestamps: z.array(z.date()),
  totalCount: z.number().int().min(0),
});

export const UserQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  views: z.number().int().min(0),
  upvotes: z.number().int().min(0),
  downvotes: z.number().int().min(0),
  answers: z.number().int().min(0),
  tags: z.array(TagSchema),
  createdAt: z.date(),
  status: z.enum(["pending", "approved", "rejected"]),
});

export const UserAnswerSchema = z.object({
  id: z.string(),
  content: z.string(),
  upvotes: z.number().int().min(0),
  downvotes: z.number().int().min(0),
  questionId: z.string(),
  createdAt: z.date(),
});

export const UserPopularTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number().int().min(0),
});

export const BadgesSchema = z.object({
  GOLD: z.number().int().min(0),
  SILVER: z.number().int().min(0),
  BRONZE: z.number().int().min(0),
});

export const UpdateProfileInputSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).optional(),
  username: UsernameSchema,
  image: z.url({ message: "Image must be a valid URL." }).nullable().optional(),
  bio: z
    .union([
      z
        .string()
        .min(10, { message: "Bio must have at least 10 characters." })
        .max(200, { message: "Bio cannot exceed 200 characters." }),
      z.literal(""),
    ])
    .nullable()
    .optional(),
  location: z
    .union([
      z
        .string()
        .min(3, { message: "Please provide proper location" })
        .max(100, { message: "Location cannot exceed 100 characters." }),
      z.literal(""),
    ])
    .nullable()
    .optional(),
  portfolio: z
    .union([z.url({ message: "Please provide valid URL" }), z.literal("")])
    .nullable()
    .optional(),
});

export const UpdateProfileSchema = z.object({
  user: UserSchema,
});

// Output Schemas
export const UserListSchema = z.object({
  users: z.array(UserSchema),
  totalUsers: z.number().int().min(0),
});

export const GetUserOutputSchema = z.object({
  user: UserSchema,
  totalQuestions: z.number().int().min(0),
  totalAnswers: z.number().int().min(0),
});

export const UserQuestionsOutputSchema = z.object({
  questions: z.array(UserQuestionSchema),
  totalQuestions: z.number().int().min(0),
});

export const UserAnswersOutputSchema = z.object({
  answers: z.array(UserAnswerSchema),
  totalAnswers: z.number().int().min(0),
});

export const UserPopularTagsSchema = z.object({
  tags: z.array(UserPopularTagSchema),
});

export const UserStatsSchema = z.object({
  totalQuestions: z.number().int().min(0),
  totalAnswers: z.number().int().min(0),
  totalUpvotes: z.number().int().min(0),
  totalViews: z.number().int().min(0),
  badges: BadgesSchema,
});

// Types
export type UserDTO = z.infer<typeof UserSchema>;
export type UserListDTO = z.infer<typeof UserListSchema>;
export type UserPostInput = z.infer<typeof UserPostSchema>;
export type GetUserInput = z.infer<typeof GetUserSchema>;
export type GetUserDTO = z.infer<typeof GetUserOutputSchema>;
export type GetUserTagsInput = z.infer<typeof GetUserTagsSchema>;
export type GetUserStatsInput = z.infer<typeof GetUserStatsSchema>;
export type UserQuestionDTO = z.infer<typeof UserQuestionSchema>;
export type UserAnswerDTO = z.infer<typeof UserAnswerSchema>;
export type UserPopularTagDTO = z.infer<typeof UserPopularTagSchema>;
export type Badges = z.infer<typeof BadgesSchema>;
export type UserStatsDTO = z.infer<typeof UserStatsSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
export type GetUserContributionsInput = z.infer<
  typeof GetUserContributionsSchema
>;
export type ContributionActivity = z.infer<typeof ContributionActivitySchema>;
export type UserContributionsOutput = z.infer<
  typeof UserContributionsOutputSchema
>;
