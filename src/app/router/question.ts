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
} from "@/server/question/question.dto";
import { z } from "zod";

export const listQuestions = base
  .input(QuestionQuerySchema)
  .handler(async ({ input }) => {
    const result = await getQuestions(input);
    return result;
  });

export const createQuestion = authorized
  .input(CreateQuestionSchema)
  .handler(async ({ input, context }) => {
    const question = await createQuestionDAL(input, context.user.id);
    return question;
  });

export const incrementViews = base
  .input(z.object({ questionId: z.string() }))
  .handler(async ({ input }) => {
    const result = await incrementQuestionViews(input.questionId);
    return result;
  });
