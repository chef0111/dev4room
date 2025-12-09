import { z } from "zod";

export const SearchInputSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(50).default(10),
  types: z
    .array(z.enum(["question", "answer", "tag", "user"]))
    .optional()
    .default(["question", "answer", "tag", "user"]),
});

export type SearchInput = z.infer<typeof SearchInputSchema>;

export const QuestionResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  authorName: z.string().nullable(),
  authorImage: z.string().nullable(),
  upvotes: z.number(),
  answers: z.number(),
  createdAt: z.date(),
  similarity: z.number(),
});

export const AnswerResultSchema = z.object({
  id: z.string(),
  content: z.string(),
  questionId: z.string(),
  questionTitle: z.string(),
  authorId: z.string(),
  authorName: z.string().nullable(),
  authorImage: z.string().nullable(),
  upvotes: z.number(),
  createdAt: z.date(),
  similarity: z.number(),
});

export const TagResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.number(),
  similarity: z.number(),
});

export const UserResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  image: z.string().nullable(),
  bio: z.string().nullable(),
  reputation: z.number(),
  similarity: z.number(),
});

export const SearchResultSchema = z.object({
  questions: z.array(QuestionResultSchema),
  answers: z.array(AnswerResultSchema),
  tags: z.array(TagResultSchema),
  users: z.array(UserResultSchema),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
export type QuestionResult = z.infer<typeof QuestionResultSchema>;
export type AnswerResult = z.infer<typeof AnswerResultSchema>;
export type TagResult = z.infer<typeof TagResultSchema>;
export type UserResult = z.infer<typeof UserResultSchema>;
