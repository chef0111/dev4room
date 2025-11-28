import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import {
  getQuestions,
  createQuestion as createQuestionDAL,
  incrementQuestionViews,
} from "@/server/question/question.dal";
import {
  QuestionQuerySchema,
  CreateQuestionSchema,
  QuestionListOutputSchema,
  CreateQuestionOutputSchema,
  IncrementViewsOutputSchema,
} from "@/server/question/question.dto";
import { z } from "zod";

export const listQuestions = base
  .route({
    method: "GET",
    path: "/questions",
    summary: "List Questions",
    tags: ["Questions"],
  })
  .input(QuestionQuerySchema)
  .output(QuestionListOutputSchema)
  .handler(async ({ input }) => {
    const result = await getQuestions(input);
    return result;
  });

export const createQuestion = authorized
  .route({
    method: "POST",
    path: "/questions",
    summary: "Create Question",
    tags: ["Questions"],
  })
  .input(CreateQuestionSchema)
  .output(CreateQuestionOutputSchema)
  .handler(async ({ input, context }) => {
    const question = await createQuestionDAL(input, context.user.id);
    return { id: question.id };
  });

export const incrementViews = base
  .route({
    method: "POST",
    path: "/questions/view",
    summary: "Increment Question Views",
    tags: ["Questions"],
  })
  .input(z.object({ questionId: z.string() }))
  .output(IncrementViewsOutputSchema)
  .handler(async ({ input }) => {
    const result = await incrementQuestionViews(input.questionId);
    return result;
  });
