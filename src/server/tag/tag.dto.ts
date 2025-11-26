import "server-only";
import z from "zod";

// Tag list item schema
export const TagListSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.number().int().min(0),
  createdAt: z.date(),
});

// Tag detail schema (with questions)
export const TagDetailSchema = TagListSchema.extend({
  updatedAt: z.date(),
});

// Query params for listing tags
export const TagQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),
  query: z.string().optional(),
  filter: z.enum(["popular", "recent", "oldest", "alphabetical"]).optional(),
});

// Query params for tag questions
export const TagQuestionsQuerySchema = z.object({
  tagId: z.string().min(1, { message: "Tag ID is required." }),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  query: z.string().optional(),
  filter: z.enum(["newest", "oldest", "popular"]).optional(),
});

// Types
export type TagListDTO = z.infer<typeof TagListSchema>;
export type TagDetailDTO = z.infer<typeof TagDetailSchema>;
export type TagQueryParams = z.infer<typeof TagQuerySchema>;
export type TagQuestionsQueryParams = z.infer<typeof TagQuestionsQuerySchema>;
