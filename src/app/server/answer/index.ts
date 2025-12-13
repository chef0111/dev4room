import { z } from "zod";
import { after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { base } from "@/app/middleware";
import { authorized } from "@/app/middleware/auth";
import {
  getAnswers,
  getAnswerById,
  createAnswer as createAnswerDAL,
  editAnswer as editAnswerDAL,
  deleteAnswer as deleteAnswerDAL,
} from "@/app/server/answer/answer.dal";
import {
  AnswerListSchema,
  AnswerSchema,
  CreateAnswerSchema,
  DeleteAnswerSchema,
  EditAnswerSchema,
  ListAnswersSchema,
} from "@/app/server/answer/answer.dto";
import { createInteraction } from "../interaction/interaction.dal";
import { indexAnswer } from "@/services/indexing.service";
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { heavyWriteSecurityMiddleware } from "@/app/middleware/arcjet/heavy-write";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";

export const listAnswers = base
  .route({
    method: "GET",
    path: "/answer",
    summary: "List Answers",
    description: "Get a paginated list of answers for a specific question",
    tags: ["Answers"],
  })
  .input(ListAnswersSchema)
  .output(AnswerListSchema)
  .handler(async ({ input }) => {
    return getAnswers(input);
  });

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
    return getAnswerById(input.answerId);
  });

export const createAnswer = authorized
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/answer",
    summary: "Create Answer",
    description: "Post an answer to a question",
    tags: ["Answers"],
  })
  .input(CreateAnswerSchema)
  .output(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const result = await createAnswerDAL(input, context.user.id);

    after(async () => {
      try {
        revalidateTag(`question:${input.questionId}`, "max");
        revalidateTag(`user:${context.user.id}`, "max");

        await Promise.all([
          createInteraction(
            {
              action: "post",
              actionType: "answer",
              actionId: result.id,
              authorId: context.user.id,
            },
            context.user.id,
          ),
          indexAnswer(result.id),
        ]);
      } catch (error) {
        console.error(
          "Failed to create interaction/index after create answer:",
          error,
        );
      }
    });

    revalidatePath(`/profile/${context.user.id}`);

    return result;
  });

export const editAnswer = authorized
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "PUT",
    path: "/answer/{answerId}",
    summary: "Edit Answer",
    description: "Update an existing answer",
    tags: ["Answers"],
  })
  .input(EditAnswerSchema)
  .output(z.object({ id: z.string(), content: z.string() }))
  .handler(async ({ input, context }) => {
    const result = await editAnswerDAL(input, context.user.id);

    after(async () => {
      try {
        await indexAnswer(result.id);
      } catch (error) {
        console.error("Failed to re-index answer after edit:", error);
      }
    });

    return result;
  });

export const deleteAnswer = authorized
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "DELETE",
    path: "/answer/{answerId}",
    summary: "Delete Answer",
    description: "Delete an answer and its associated votes",
    tags: ["Answers"],
  })
  .input(DeleteAnswerSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await deleteAnswerDAL(input.answerId, context.user.id);

    after(async () => {
      try {
        revalidateTag(`user:${context.user.id}`, "max");
        await createInteraction(
          {
            action: "delete",
            actionType: "answer",
            actionId: input.answerId,
            authorId: context.user.id,
          },
          context.user.id,
        );
      } catch (error) {
        console.error(
          "Failed to create interaction after delete answer:",
          error,
        );
      }
    });

    revalidatePath(`/profile/${context.user.id}`);

    return { success: true };
  });
