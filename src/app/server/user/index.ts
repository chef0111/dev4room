import { base } from "@/app/middleware";
import {
  getUsers,
  getUserById,
  getUserQuestions as getUserQuestionsDAL,
  getUserAnswers as getUserAnswersDAL,
  getUserPopularTags as getUserPopularTagsDAL,
  getUserStats as getUserStatsDAL,
} from "@/app/server/user/user.dal";
import {
  UserListSchema,
  GetUserSchema,
  GetUserOutputSchema,
  GetUserTagsSchema,
  GetUserStatsSchema,
  UserQuestionsOutputSchema,
  UserAnswersOutputSchema,
  UserPopularTagsOutputSchema,
  UserStatsSchema,
  UserPostSchema,
} from "@/app/server/user/user.dto";
import { QueryParamsSchema } from "@/lib/validations";

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

export const getUser = base
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
    return getUserById(input.userId);
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

export const getUserStatsRoute = base
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
