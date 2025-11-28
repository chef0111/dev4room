import "server-only";
import z from "zod";

// Author schema for embedded author data
export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

// Tag schema for embedded tag data
export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Question list item schema (for listing questions)
export const QuestionListSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  views: z.number().int().min(0),
  upvotes: z.number().int().min(0),
  downvotes: z.number().int().min(0),
  answers: z.number().int().min(0),
  author: AuthorSchema,
  tags: z.array(TagSchema),
  createdAt: z.date(),
});

// Question detail schema (for single question view)
export const QuestionDetailSchema = QuestionListSchema.extend({
  updatedAt: z.date(),
});

// Create question input schema
export const CreateQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters long." }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag cannot be empty." })
        .max(20, { message: "Tag cannot exceed 20 characters." }),
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "You can add a maximum of 5 tags." }),
});

// Query params schema for listing questions
export const QuestionQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  query: z.string().optional(),
  filter: z.enum(["newest", "oldest", "popular", "unanswered"]).optional(),
});

// Output schemas for procedures
export const QuestionListOutputSchema = z.object({
  questions: z.array(QuestionListSchema),
  totalQuestions: z.number().int().min(0),
});

export const CreateQuestionOutputSchema = z.object({
  id: z.string(),
});

export const IncrementViewsOutputSchema = z.object({
  views: z.number().int().min(0),
});

// Types
export type AuthorDTO = z.infer<typeof AuthorSchema>;
export type TagDTO = z.infer<typeof TagSchema>;
export type QuestionListDTO = z.infer<typeof QuestionListSchema>;
export type QuestionDetailDTO = z.infer<typeof QuestionDetailSchema>;
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;
export type QuestionQueryParams = z.infer<typeof QuestionQuerySchema>;
export type QuestionListOutput = z.infer<typeof QuestionListOutputSchema>;
export type CreateQuestionOutput = z.infer<typeof CreateQuestionOutputSchema>;
