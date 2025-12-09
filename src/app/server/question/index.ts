import { z } from "zod";
import { after } from "next/server";
import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import {
  getQuestions,
  getQuestionById,
  createQuestion as createQuestionDAL,
  editQuestion as editQuestionDAL,
  getTopQuestions as getTopQuestionsDAL,
  deleteQuestion as deleteQuestionDAL,
} from "@/app/server/question/question.dal";
import {
  CreateQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  QuestionListOutputSchema,
  QuestionSchema,
  TagSchema,
  TopQuestionsOutputSchema,
} from "@/app/server/question/question.dto";
import { QueryParamsSchema } from "@/lib/validations";
import { createInteraction } from "../interaction/interaction.dal";
import { indexQuestion, indexTag } from "@/services/indexing.service";
import { TagQuestionService } from "../tag-question/service";

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

    // Get any newly created tags for indexing
    const newTagIds = TagQuestionService.getPendingTagIds();

    after(async () => {
      try {
        await Promise.all([
          createInteraction(
            {
              action: "post",
              actionType: "question",
              actionId: question.id,
              authorId: context.user.id,
            },
            context.user.id,
          ),
          indexQuestion(question.id),
          // Index any new tags that were created
          ...newTagIds.map((tagId) => indexTag(tagId)),
        ]);
      } catch (error) {
        console.error(
          "Failed to create interaction/index after create question:",
          error,
        );
      }
    });
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

    // Get any newly created tags for indexing
    const newTagIds = TagQuestionService.getPendingTagIds();

    after(async () => {
      try {
        await Promise.all([
          indexQuestion(result.id),
          // Index any new tags that were created
          ...newTagIds.map((tagId) => indexTag(tagId)),
        ]);
      } catch (error) {
        console.error("Failed to re-index question/tags after edit:", error);
      }
    });

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

export const deleteQuestion = authorized
  .route({
    method: "DELETE",
    path: "/question/{questionId}",
    summary: "Delete Question",
    tags: ["Questions"],
  })
  .input(DeleteQuestionSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await deleteQuestionDAL(input.questionId, context.user.id);

    after(async () => {
      try {
        await createInteraction(
          {
            action: "delete",
            actionType: "question",
            actionId: input.questionId,
            authorId: context.user.id,
          },
          context.user.id,
        );
      } catch (error) {
        console.error(
          "Failed to create interaction after delete question:",
          error,
        );
      }
    });

    return { success: true };
  });
