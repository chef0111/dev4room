import { z } from "zod";
import { after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import {
  getQuestions,
  getQuestionById,
  createQuestion as createQuestionDAL,
  editQuestion as editQuestionDAL,
  getTopQuestions as getTopQuestionsDAL,
  deleteQuestion as deleteQuestionDAL,
  getUserPendingQuestions as getUserPendingQuestionsDAL,
  cancelPendingQuestion as cancelPendingQuestionDAL,
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
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { heavyWriteSecurityMiddleware } from "@/app/middleware/arcjet/heavy-write";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";
import { ViewService } from "@/services/view.service";

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
    const [result, views] = await Promise.all([
      getQuestionById(input.questionId),
      ViewService.getViewCount(input.questionId),
    ]);
    return { ...result, views };
  });

export const createQuestion = authorized
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/question",
    summary: "Create Question",
    tags: ["Questions"],
  })
  .input(CreateQuestionSchema)
  .output(z.object({ id: z.string(), status: z.string() }))
  .handler(async ({ input, context }) => {
    const question = await createQuestionDAL(
      input,
      context.user.id,
      context.user.reputation ?? 0
    );

    // Get any newly created tags for indexing
    const newTagIds = TagQuestionService.getPendingTagIds();

    after(async () => {
      try {
        revalidateTag("questions", "max");
        revalidateTag(`user:${context.user.id}`, "max");

        // Only index approved questions
        if (question.status === "approved") {
          await Promise.all([
            createInteraction(
              {
                action: "post",
                actionType: "question",
                actionId: question.id,
                authorId: context.user.id,
              },
              context.user.id
            ),
            indexQuestion(question.id),
            // Index any new tags that were created
            ...newTagIds.map((tagId) => indexTag(tagId)),
          ]);
        }
      } catch (error) {
        console.error(
          "Failed to create interaction/index after create question:",
          error
        );
      }
    });

    revalidatePath(`/profile/${context.user.id}`);

    return { id: question.id, status: question.status };
  });

export const editQuestion = authorized
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
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
    })
  )
  .handler(async ({ input, context }) => {
    const result = await editQuestionDAL(input, context.user.id);

    // Get any newly created tags for indexing
    const newTagIds = TagQuestionService.getPendingTagIds();

    after(async () => {
      try {
        revalidateTag(`question:${result.id}`, "max");
        revalidateTag("questions", "max");

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
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
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
        revalidateTag(`question:${input.questionId}`, "max");
        revalidateTag("questions", "max");
        revalidateTag("tags", "max");
        revalidateTag(`user:${context.user.id}`, "max");

        await createInteraction(
          {
            action: "delete",
            actionType: "question",
            actionId: input.questionId,
            authorId: context.user.id,
          },
          context.user.id
        );
      } catch (error) {
        console.error(
          "Failed to create interaction after delete question:",
          error
        );
      }
    });

    revalidatePath(`/profile/${context.user.id}`);

    return { success: true };
  });

export const getUserPendingQuestions = authorized
  .use(standardSecurityMiddleware)
  .route({
    method: "GET",
    path: "/question/pending",
    summary: "Get User's Pending Questions",
    tags: ["Questions"],
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        createdAt: z.date(),
        upvotes: z.number(),
        answers: z.number(),
        views: z.number(),
        authorId: z.string(),
        authorName: z.string(),
        authorImage: z.string().nullable(),
        tags: z.array(z.object({ id: z.string(), name: z.string() })),
      })
    )
  )
  .handler(async ({ context }) => {
    return getUserPendingQuestionsDAL(context.user.id);
  });

export const cancelPendingQuestion = authorized
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "DELETE",
    path: "/question/pending/{questionId}",
    summary: "Cancel Pending Question",
    tags: ["Questions"],
  })
  .input(z.object({ questionId: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await cancelPendingQuestionDAL(input.questionId, context.user.id);

    after(async () => {
      revalidateTag(`user:${context.user.id}`, "max");
    });

    return { success: true };
  });
