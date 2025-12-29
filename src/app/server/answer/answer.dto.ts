import "server-only";
import z from "zod";

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  image: z.string().nullable(),
});

export const AnswerSchema = z.object({
  id: z.string(),
  content: z.string(),
  upvotes: z.number().int().min(0),
  downvotes: z.number().int().min(0),
  author: AuthorSchema,
  questionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Schemas
export const CreateAnswerSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
  content: z
    .string()
    .min(10, { message: "Answer must be at least 10 characters long." }),
});

export const EditAnswerSchema = z.object({
  answerId: z.string().min(1, { message: "Answer ID is required." }),
  content: z
    .string()
    .min(20, { message: "Answer must be at least 10 characters long." }),
});

export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, { message: "Answer ID is required." }),
});

export const ListAnswersSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  filter: z.enum(["latest", "oldest", "popular"]).optional(),
});

// Output Schemas
export const AnswerListSchema = z.object({
  answers: z.array(AnswerSchema),
  totalAnswers: z.number().int().min(0),
});

// Types
export type Author = z.infer<typeof AuthorSchema>;
export type AnswerDTO = z.infer<typeof AnswerSchema>;
export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>;
export type EditAnswerInput = z.infer<typeof EditAnswerSchema>;
export type DeleteAnswerInput = z.infer<typeof DeleteAnswerSchema>;
export type ListAnswersInput = z.infer<typeof ListAnswersSchema>;
export type AnswerListDTO = z.infer<typeof AnswerListSchema>;
