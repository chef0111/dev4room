import "server-only";
import z from "zod";
import { QuestionListSchema } from "@/app/server/question/question.dto";
import { QueryParamsSchema } from "@/lib/validations";

export const TagsSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.number().int().min(0),
  createdAt: z.date(),
});

export const TagDetailSchema = TagsSchema.extend({
  updatedAt: z.date(),
});

export const TagQuestionsQuerySchema = QueryParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required." }),
});

// Output Schemas
export const TagListSchema = z.object({
  tags: z.array(TagsSchema),
  totalTags: z.number().int().min(0),
});

export const TagQuestionsSchema = z.object({
  tag: TagDetailSchema,
  questions: z.array(QuestionListSchema),
  totalQuestions: z.number().int().min(0),
});

export const PopularTagsSchema = z.object({
  tags: z.array(TagsSchema.omit({ createdAt: true })),
});

export type TagsDTO = z.infer<typeof TagsSchema>;
export type TagDetail = z.infer<typeof TagDetailSchema>;
export type TagQuestionsQueryParams = z.infer<typeof TagQuestionsQuerySchema>;
export type TagListDTO = z.infer<typeof TagListSchema>;
export type TagQuestionsDTO = z.infer<typeof TagQuestionsSchema>;
export type PopularTagsDTO = z.infer<typeof PopularTagsSchema>;
