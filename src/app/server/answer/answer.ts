import z from "zod";
import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import { ORPCError } from "@orpc/server";
import {
  createAnswer,
  getAnswersByQuestionId,
  getAnswerById,
} from "./answer.dal";
import {
  AnswerSchema,
  CreateAnswerInputSchema,
  CreateAnswerOutputSchema,
  AnswerListOutputSchema,
} from "./answer.dto";
import { QueryParamsSchema } from "@/lib/validations";

// POST /answer - Create a new answer (authenticated users only)
export const postAnswer = authorized
  .route({
    method: "POST",
    path: "/answer",
    summary: "Create Answer",
    tags: ["Answers"],
  })
  .input(CreateAnswerInputSchema)
  .output(CreateAnswerOutputSchema)
  .handler(async ({ input, context }) => {
    const userId = context.user.id;

    // Create the answer (DAL handles transaction: insert + increment counts + reputation)
    const answer = await createAnswer(input, userId);

    return { answer };
  });

// GET /answer?questionId=xxx - List answers for a question (public)
export const listAnswers = base
  .route({
    method: "GET",
    path: "/answer",
    summary: "List Answers for Question",
    tags: ["Answers"],
  })
  .input(
    QueryParamsSchema.extend({
      questionId: z.string().min(1, { message: "Question ID is required." }),
    }),
  )
  .output(AnswerListOutputSchema)
  .handler(async ({ input }) => {
    const { questionId, ...paginationParams } = input;

    const result = await getAnswersByQuestionId(questionId, paginationParams);

    return result;
  });

// GET /answer/{answerId} - Get a single answer by ID (public)
export const getAnswer = base
  .route({
    method: "GET",
    path: "/answer/{answerId}",
    summary: "Get Answer by ID",
    tags: ["Answers"],
  })
  .input(z.object({ answerId: z.string() }))
  .output(AnswerSchema)
  .handler(async ({ input }) => {
    const answer = await getAnswerById(input.answerId);

    return answer;
  });
