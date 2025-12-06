import "server-only";
import z from "zod";

// Input Schemas
export const ToggleSaveSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const HasSavedSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

// Output Schemas
export const ToggleSaveOutputSchema = z.object({
  saved: z.boolean(),
});

export const HasSavedOutputSchema = z.object({
  saved: z.boolean(),
});

// Types
export type ToggleSaveInput = z.infer<typeof ToggleSaveSchema>;
export type HasSavedInput = z.infer<typeof HasSavedSchema>;
export type ToggleSaveOutput = z.infer<typeof ToggleSaveOutputSchema>;
export type HasSavedOutput = z.infer<typeof HasSavedOutputSchema>;
