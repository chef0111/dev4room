import "server-only";
import z from "zod";

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  image: z.string().nullable(),
});

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const QuestionSchema = z.object({
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
  updatedAt: z.date(),
  status: z.enum(["pending", "approved", "rejected"]),
});

// Input Schemas
export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

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
        .max(20, { message: "Tag cannot exceed 20 characters." })
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "You can add a maximum of 5 tags." }),
});

export const EditQuestionSchema = CreateQuestionSchema.extend({
  questionId: z.string(),
});

// Output Schemas
export const QuestionListSchema = QuestionSchema.omit({ updatedAt: true });
export const QuestionListOutputSchema = z.object({
  questions: z.array(QuestionListSchema),
  totalQuestions: z.number().int().min(0),
});

export const TopQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema.pick({ id: true, title: true })),
});

export const PendingQuestionsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    status: z.enum(["pending", "approved", "rejected"]),
    rejectReason: z.string().nullable(),
    createdAt: z.date(),
    upvotes: z.number(),
    answers: z.number(),
    views: z.number(),
    authorId: z.string(),
    authorName: z.string(),
    authorUsername: z.string(),
    authorImage: z.string().nullable(),
    tags: z.array(z.object({ id: z.string(), name: z.string() })),
  })
);

// Duplicate Check Schemas
export const CheckDuplicateInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  excludeQuestionId: z.string().optional(),
});

export const CheckDuplicateOutputSchema = z.object({
  hasDuplicate: z.boolean(),
  duplicates: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      titleSimilarity: z.number().optional(),
      contentSimilarity: z.number().optional(),
    })
  ),
});

// Types
export type Author = z.infer<typeof AuthorSchema>;
export type TagDTO = z.infer<typeof TagSchema>;
export type QuestionDTO = z.infer<typeof QuestionSchema>;
export type QuestionListDTO = z.infer<typeof QuestionListSchema>;
export type DeleteQuestionInput = z.infer<typeof DeleteQuestionSchema>;
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;
export type EditQuestionInput = z.infer<typeof EditQuestionSchema>;
export type QuestionListOutput = z.infer<typeof QuestionListOutputSchema>;
export type TopQuestionsOutput = z.infer<typeof TopQuestionsOutputSchema>;
export type PendingQuestionDTO = z.infer<typeof PendingQuestionsSchema>;
export type CheckDuplicateInput = z.infer<typeof CheckDuplicateInputSchema>;
export type CheckDuplicateOutput = z.infer<typeof CheckDuplicateOutputSchema>;
