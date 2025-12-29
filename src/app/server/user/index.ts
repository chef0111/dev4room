import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";
import {
  getUsers,
  getUserById as getUserByIdDAL,
  getUser as getUserDAL,
  getUserQuestions as getUserQuestionsDAL,
  getUserAnswers as getUserAnswersDAL,
  getUserPopularTags as getUserPopularTagsDAL,
  getUserStats as getUserStatsDAL,
  updateUser as updateUserDAL,
} from "@/app/server/user/user.dal";
import {
  UserListSchema,
  GetUserSchema,
  GetUserByUsernameSchema,
  GetUserOutputSchema,
  GetUserTagsSchema,
  GetUserStatsSchema,
  UserQuestionsOutputSchema,
  UserAnswersOutputSchema,
  UserPopularTagsOutputSchema,
  UserStatsSchema,
  UserPostSchema,
  UpdateProfileInputSchema,
  UpdateProfileSchema,
} from "@/app/server/user/user.dto";
import { QueryParamsSchema } from "@/lib/validations";
import { indexUser } from "@/services/indexing.service";

export const listUsers = base
  .route({
    method: "GET",
    path: "/user",
    summary: "List Users",
    description:
      "Get a paginated list of all users with optional search and filter",
    tags: ["Users"],
  })
  .input(QueryParamsSchema)
  .output(UserListSchema)
  .handler(async ({ input }) => {
    return getUsers(input);
  });

export const getUserById = base
  .route({
    method: "GET",
    path: "/user/{userId}",
    summary: "Get User by ID",
    description:
      "Get detailed user information including question and answer counts",
    tags: ["Users"],
  })
  .input(GetUserSchema)
  .output(GetUserOutputSchema)
  .handler(async ({ input }) => {
    return getUserByIdDAL(input.userId);
  });

export const getUser = base
  .route({
    method: "GET",
    path: "/user/username/{username}",
    summary: "Get User by Username",
    description: "Get detailed user information by username",
    tags: ["Users"],
  })
  .input(GetUserByUsernameSchema)
  .output(GetUserOutputSchema)
  .handler(async ({ input }) => {
    return getUserDAL(input.username);
  });

export const getUserQuestions = base
  .route({
    method: "GET",
    path: "/user/{userId}/questions",
    summary: "Get User Questions",
    description: "Get a paginated list of questions posted by a specific user",
    tags: ["Users", "Questions"],
  })
  .input(UserPostSchema)
  .output(UserQuestionsOutputSchema)
  .handler(async ({ input }) => {
    return getUserQuestionsDAL(input);
  });

export const getUserAnswers = base
  .route({
    method: "GET",
    path: "/user/{userId}/answers",
    summary: "Get User Answers",
    description: "Get a paginated list of answers posted by a specific user",
    tags: ["Users", "Answers"],
  })
  .input(UserPostSchema)
  .output(UserAnswersOutputSchema)
  .handler(async ({ input }) => {
    return getUserAnswersDAL(input);
  });

export const getUserTags = base
  .route({
    method: "GET",
    path: "/user/{userId}/tags",
    summary: "Get User Popular Tags",
    description: "Get the most frequently used tags by a specific user",
    tags: ["Users", "Tags"],
  })
  .input(GetUserTagsSchema)
  .output(UserPopularTagsOutputSchema)
  .handler(async ({ input }) => {
    return getUserPopularTagsDAL(input);
  });

export const getUserStats = base
  .route({
    method: "GET",
    path: "/user/{userId}/stats",
    summary: "Get User Stats",
    description:
      "Get user statistics including questions, answers, upvotes, views, and badges",
    tags: ["Users"],
  })
  .input(GetUserStatsSchema)
  .output(UserStatsSchema)
  .handler(async ({ input }) => {
    return getUserStatsDAL(input);
  });

export const updateUser = authorized
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "PATCH",
    path: "/user/profile",
    summary: "Update User Profile",
    tags: ["Users"],
  })
  .input(UpdateProfileInputSchema)
  .output(UpdateProfileSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const updatedUser = await updateUserDAL(user.id, input);

    after(async () => {
      try {
        revalidateTag(`user:${user.id}`, "max");

        await indexUser(user.id);
      } catch (error) {
        console.error("Failed to re-index user after profile update:", error);
      }
    });

    return { user: updatedUser };
  });
