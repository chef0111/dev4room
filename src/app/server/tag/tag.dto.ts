import "server-only";
import z from "zod";
import { QuestionListSchema } from "@/app/server/question/question.dto";

export const TagsSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.number().int().min(0),
  createdAt: z.date(),
});

export const TagDetailSchema = TagsSchema.extend({
  updatedAt: z.date(),
});

// Input Schemas
export const TagQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),
  query: z.string().optional(),
  filter: z.enum(["popular", "recent", "oldest", "alphabetical"]).optional(),
});

export const TagQuestionsQuerySchema = z.object({
  tagId: z.string().min(1, { message: "Tag ID is required." }),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  query: z.string().optional(),
  filter: z.enum(["newest", "oldest", "popular"]).optional(),
});

// Output Schemas
export const TagListOutputSchema = z.object({
  tags: z.array(TagsSchema),
  totalTags: z.number().int().min(0),
});

export const TagQuestionsOutputSchema = z.object({
  tag: TagDetailSchema,
  questions: z.array(QuestionListSchema),
  totalQuestions: z.number().int().min(0),
});

export type TagsDTO = z.infer<typeof TagsSchema>;
export type TagDetail = z.infer<typeof TagDetailSchema>;
export type TagQueryParams = z.infer<typeof TagQuerySchema>;
export type TagQuestionsQueryParams = z.infer<typeof TagQuestionsQuerySchema>;
export type TagListOutput = z.infer<typeof TagListOutputSchema>;
export type TagQuestionsOutput = z.infer<typeof TagQuestionsOutputSchema>;
