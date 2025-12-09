import { z } from "zod";

export const GenerateAnswerInputSchema = z.object({
  question: z
    .string()
    .min(10, { message: "Question must have at least 10 characters." })
    .max(500, { message: "Question cannot exceed 500 characters." }),
  content: z
    .string()
    .min(20, { message: "Context must have at least 20 characters." }),
  userAnswer: z
    .string()
    .min(20, { message: "Your answer must have at least 20 characters." }),
});

export const GenerateAnswerOutputSchema = z.object({
  isValid: z.boolean(),
  answer: z.string().optional(),
  reason: z.string().optional(),
});

// Internal schema for AI structured output
export const AIResponseSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      "Whether the user answer is relevant and meaningful to the question",
    ),
  answer: z
    .string()
    .optional()
    .describe("The enhanced markdown answer (only if isValid is true)"),
  reason: z
    .string()
    .optional()
    .describe(
      "Rejection reason explaining why the answer is not acceptable (only if isValid is false)",
    ),
});

export type GenerateAnswerInput = z.infer<typeof GenerateAnswerInputSchema>;
export type GenerateAnswerOutput = z.infer<typeof GenerateAnswerOutputSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
