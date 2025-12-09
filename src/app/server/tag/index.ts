import { z } from "zod";
import { base } from "@/app/middleware";
import {
  getTags,
  getTagWithQuestions,
  getPopularTags,
} from "@/app/server/tag/tag.dal";
import {
  TagQuestionsQuerySchema,
  TagListSchema,
  TagQuestionsSchema,
  PopularTagsSchema,
} from "@/app/server/tag/tag.dto";
import { QueryParamsSchema } from "@/lib/validations";

export const listTags = base
  .route({
    method: "GET",
    path: "/tag",
    summary: "List Tags",
    tags: ["Tags"],
  })
  .input(QueryParamsSchema)
  .output(TagListSchema)
  .handler(async ({ input }) => {
    const result = await getTags(input);
    return result;
  });

export const getTagQuestions = base
  .route({
    method: "GET",
    path: "/tag/questions",
    summary: "Get Tag Questions",
    tags: ["Tags", "Questions"],
  })
  .input(TagQuestionsQuerySchema)
  .output(TagQuestionsSchema)
  .handler(async ({ input }) => {
    const result = await getTagWithQuestions(input);
    return result;
  });

export const getPopular = base
  .route({
    method: "GET",
    path: "/tag/popular",
    summary: "Get Popular Tags",
    tags: ["Tags"],
  })
  .input(z.object({ limit: z.number().int().default(5) }))
  .output(PopularTagsSchema)
  .handler(async ({ input }) => {
    const tags = await getPopularTags(input.limit);
    return { tags };
  });
