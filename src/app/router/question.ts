import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import {
  getQuestions,
  getQuestionById,
  createQuestion as createQuestionDAL,
  editQuestion as editQuestionDAL,
  incrementQuestionViews,
} from "@/server/question/question.dal";
import {
  QuestionQuerySchema,
  GetQuestionSchema,
  CreateQuestionSchema,
  EditQuestionSchema,
  QuestionListOutputSchema,
  GetQuestionOutputSchema,
  CreateQuestionOutputSchema,
  EditQuestionOutputSchema,
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

export const getQuestion = base
  .route({
    method: "GET",
    path: "/questions/{questionId}",
    summary: "Get Question by ID",
    tags: ["Questions"],
  })
  .input(GetQuestionSchema)
  .output(GetQuestionOutputSchema)
  .handler(async ({ input }) => {
    const result = await getQuestionById(input.questionId);
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

export const editQuestion = authorized
  .route({
    method: "PUT",
    path: "/questions/{questionId}",
    summary: "Edit Question",
    tags: ["Questions"],
  })
  .input(EditQuestionSchema)
  .output(EditQuestionOutputSchema)
  .handler(async ({ input, context }) => {
    const result = await editQuestionDAL(input, context.user.id);
    return result;
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
