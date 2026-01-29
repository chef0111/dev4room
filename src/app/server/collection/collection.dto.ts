import "server-only";
import z from "zod";
import { AuthorSchema, TagSchema } from "../question/question.dto";

// Filter types for collection
export type CollectionFilter =
  | "mostRecent"
  | "oldest"
  | "mostVoted"
  | "mostViewed"
  | "mostAnswered";

// Input Schemas
export const ToggleSaveSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const HasSavedSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

// Collection item schema (saved question)
export const CollectionItemSchema = z.object({
  id: z.string(),
  question: z.object({
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
    status: z.enum(["pending", "approved", "rejected"]),
  }),
  savedAt: z.date(),
});

// Output Schemas
export const ToggleSaveOutputSchema = z.object({
  saved: z.boolean(),
});

export const HasSavedOutputSchema = z.object({
  saved: z.boolean(),
});

export const ListCollectionSchema = z.object({
  collections: z.array(CollectionItemSchema),
  totalCollections: z.number().int().min(0),
});

// Types
export type ToggleSaveInput = z.infer<typeof ToggleSaveSchema>;
export type HasSavedInput = z.infer<typeof HasSavedSchema>;
export type ToggleSaveOutput = z.infer<typeof ToggleSaveOutputSchema>;
export type HasSavedOutput = z.infer<typeof HasSavedOutputSchema>;
export type CollectionItem = z.infer<typeof CollectionItemSchema>;
export type ListCollectionDTO = z.infer<typeof ListCollectionSchema>;
