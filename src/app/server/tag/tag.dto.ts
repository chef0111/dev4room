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

// Output schemas for procedures
export const TagListOutputSchema = z.object({
  tags: z.array(TagListSchema),
  totalTags: z.number().int().min(0),
});

export const TagQuestionsOutputSchema = z.object({
  tag: TagDetailSchema,
  questions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      views: z.number().int().min(0),
      upvotes: z.number().int().min(0),
      downvotes: z.number().int().min(0),
      answers: z.number().int().min(0),
      author: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      }),
      tags: z.array(z.object({ id: z.string(), name: z.string() })),
      createdAt: z.date(),
    }),
  ),
  totalQuestions: z.number().int().min(0),
});

export const PopularTagsOutputSchema = z.array(TagListSchema);

// Types
export type TagListDTO = z.infer<typeof TagListSchema>;
export type TagDetailDTO = z.infer<typeof TagDetailSchema>;
export type TagQueryParams = z.infer<typeof TagQuerySchema>;
export type TagQuestionsQueryParams = z.infer<typeof TagQuestionsQuerySchema>;
export type TagListOutput = z.infer<typeof TagListOutputSchema>;
export type TagQuestionsOutput = z.infer<typeof TagQuestionsOutputSchema>;
