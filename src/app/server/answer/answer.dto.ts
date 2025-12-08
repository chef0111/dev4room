import "server-only";
import z from "zod";
import { AuthorSchema } from "../question/question.dto";

// Canonical answer shape - defines what a full answer looks like
export const AnswerSchema = z.object({
  id: z.string(),
  content: z.string(),
  upvotes: z.number().int().min(0),
  downvotes: z.number().int().min(0),
  author: AuthorSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Schema - Fields user can provide when creating an answer
export const CreateAnswerInputSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
  content: z
    .string()
    .min(20, { message: "Answer must be at least 20 characters long." })
    .max(10000, { message: "Answer cannot exceed 10000 characters." }),
});

// Output Schema - Response envelope for creating an answer
export const CreateAnswerOutputSchema = z.object({
  answer: AnswerSchema,
});

// List of answers for a question (omit updatedAt for list view)
export const AnswerListSchema = AnswerSchema.omit({ updatedAt: true });

// Output Schema - Response envelope for listing answers
export const AnswerListOutputSchema = z.object({
  answers: z.array(AnswerListSchema),
  totalAnswers: z.number().int().min(0),
});

// Types
export type AnswerDTO = z.infer<typeof AnswerSchema>;
export type AnswerListDTO = z.infer<typeof AnswerListSchema>;
export type CreateAnswerInput = z.infer<typeof CreateAnswerInputSchema>;
export type CreateAnswerOutput = z.infer<typeof CreateAnswerOutputSchema>;
export type AnswerListOutput = z.infer<typeof AnswerListOutputSchema>;
