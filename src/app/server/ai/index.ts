import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { authorized } from "@/app/middleware/auth";
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { heavyWriteSecurityMiddleware } from "@/app/middleware/arcjet/heavy-write";
import {
  GenerateAnswerInputSchema,
  GenerateAnswerOutputSchema,
  AIResponseSchema,
} from "./ai.dto";

export const generateAnswer = authorized
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/ai/answer",
    summary: "Generate AI Answer",
    description:
      "Validate user answer relevance and generate an enhanced markdown-formatted AI answer",
    tags: ["AI"],
  })
  .input(GenerateAnswerInputSchema)
  .output(GenerateAnswerOutputSchema)
  .handler(async ({ input }) => {
    const { question, content, userAnswer } = input;

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: AIResponseSchema,
      prompt: `You are evaluating a user's answer to a question and potentially enhancing it to the fullest.

**Question:** ${question}

**Question Context:** ${content}

**User's Answer:** ${userAnswer}

Your task:
1. First, evaluate if the user's answer is relevant and meaningful to the question:
   - The answer must actually address the question being asked
   - The answer must contain substantive content (not just filler text or random words)
   - The answer must show some understanding or attempt to answer the question

2. If the answer IS valid and relevant:
   - Set isValid to true
   - Generate an enhanced, well-structured markdown answer that improves upon or validates the user's answer
   - If the user's answer is correct, enhance it with better formatting and additional context
   - If the user's answer is partially correct or incomplete, improve and complete it
   - If the user's answer has minor errors, correct them while preserving the user's intent

3. If the answer is NOT valid (off-topic, gibberish, or completely unrelated):
   - Set isValid to false
   - Provide a helpful, constructive reason explaining why the answer was not accepted
   - The reason should guide the user on what kind of answer would be appropriate
   - Be polite and encouraging in the rejection message`,
      system:
        "You are a helpful assistant that evaluates and enhances answers to its FULLEST POTENTIAL. For valid answers, provide responses in markdown format with appropriate syntax for headings, lists, code blocks (use short language identifiers like 'js', 'py', 'ts'), and emphasis. Be constructive and educational in rejection messages.",
    });

    return {
      isValid: object.isValid,
      answer: object.answer,
      reason: object.reason,
    };
  });
