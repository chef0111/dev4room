import { base } from "@/app/middleware";
import {
  getTags,
  getTagWithQuestions,
  getPopularTags,
} from "@/server/tag/tag.dal";
import { TagQuerySchema, TagQuestionsQuerySchema } from "@/server/tag/tag.dto";
import { z } from "zod";

export const listTags = base
  .input(TagQuerySchema)
  .handler(async ({ input }) => {
    const result = await getTags(input);
    return result;
  });

export const getTagQuestions = base
  .input(TagQuestionsQuerySchema)
  .handler(async ({ input }) => {
    const result = await getTagWithQuestions(input);
    return result;
  });

export const getPopular = base
  .input(z.object({ limit: z.number().optional().default(5) }))
  .handler(async ({ input }) => {
    const result = await getPopularTags(input.limit);
    return result;
  });
