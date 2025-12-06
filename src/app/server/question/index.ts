import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import {
  getQuestions,
  getQuestionById,
  createQuestion as createQuestionDAL,
  editQuestion as editQuestionDAL,
  getTopQuestions as getTopQuestionsDAL,
} from "@/app/server/question/question.dal";
import {
  CreateQuestionSchema,
  EditQuestionSchema,
  QuestionListOutputSchema,
  QuestionSchema,
  TagSchema,
  TopQuestionsOutputSchema,
} from "@/app/server/question/question.dto";
import { QueryParamsSchema } from "@/lib/validations";
import { z } from "zod";

export const listQuestions = base
  .route({
    method: "GET",
    path: "/question",
    summary: "List Questions",
    tags: ["Questions"],
  })
  .input(QueryParamsSchema)
  .output(QuestionListOutputSchema)
  .handler(async ({ input }) => {
    const result = await getQuestions(input);
    return result;
  });

export const getQuestion = base
  .route({
    method: "GET",
    path: "/question/{questionId}",
    summary: "Get Question by ID",
    tags: ["Questions"],
  })
  .input(z.object({ questionId: z.string() }))
  .output(QuestionSchema)
  .handler(async ({ input }) => {
    const result = await getQuestionById(input.questionId);
    return result;
  });

export const createQuestion = authorized
  .route({
    method: "POST",
    path: "/question",
    summary: "Create Question",
    tags: ["Questions"],
  })
  .input(CreateQuestionSchema)
  .output(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const question = await createQuestionDAL(input, context.user.id);
    return { id: question.id };
  });

export const editQuestion = authorized
  .route({
    method: "PUT",
    path: "/question/{questionId}",
    summary: "Edit Question",
    tags: ["Questions"],
  })
  .input(EditQuestionSchema)
  .output(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      tags: z.array(TagSchema),
    }),
  )
  .handler(async ({ input, context }) => {
    const result = await editQuestionDAL(input, context.user.id);
    return result;
  });

export const getTopQuestions = base
  .route({
    method: "GET",
    path: "/question/top",
    summary: "Get Top Questions",
    description: "Get top questions sorted by views and upvotes",
    tags: ["Questions"],
  })
  .input(z.object({ limit: z.number().int().default(5) }))
  .output(TopQuestionsOutputSchema)
  .handler(async ({ input }) => {
    const questions = await getTopQuestionsDAL(input.limit);
    return { questions };
  });
