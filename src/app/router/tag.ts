import { base } from "@/app/middleware";
import {
  getTags,
  getTagWithQuestions,
  getPopularTags,
} from "@/server/tag/tag.dal";
import {
  TagQuerySchema,
  TagQuestionsQuerySchema,
  TagListOutputSchema,
  TagQuestionsOutputSchema,
  PopularTagsOutputSchema,
} from "@/server/tag/tag.dto";
import { z } from "zod";

export const listTags = base
  .route({
    method: "GET",
    path: "/tags",
    summary: "List Tags",
    tags: ["Tags"],
  })
  .input(TagQuerySchema)
  .output(TagListOutputSchema)
  .handler(async ({ input }) => {
    const result = await getTags(input);
    return result;
  });

export const getTagQuestions = base
  .route({
    method: "GET",
    path: "/tags/questions",
    summary: "Get Tag Questions",
    tags: ["Tags", "Questions"],
  })
  .input(TagQuestionsQuerySchema)
  .output(TagQuestionsOutputSchema)
  .handler(async ({ input }) => {
    const result = await getTagWithQuestions(input);
    return result;
  });

export const getPopular = base
  .route({
    method: "GET",
    path: "/tags/popular",
    summary: "Get Popular Tags",
    tags: ["Tags"],
  })
  .input(z.object({ limit: z.number().optional().default(5) }))
  .output(PopularTagsOutputSchema)
  .handler(async ({ input }) => {
    const result = await getPopularTags(input.limit);
    return result;
  });
