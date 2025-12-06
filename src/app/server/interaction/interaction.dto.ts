import "server-only";
import z from "zod";

// Action types for interactions
export const InteractionActions = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

export const ActionTargets = ["question", "answer"] as const;

// Base Schema
export const InteractionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.enum(InteractionActions),
  actionId: z.string(),
  actionType: z.enum(ActionTargets),
  createdAt: z.date(),
});

// Input Schemas
export const CreateInteractionSchema = z.object({
  action: z.enum(InteractionActions),
  actionType: z.enum(ActionTargets),
  actionId: z.string().min(1, { message: "Action is required." }),
  authorId: z.string().min(1, { message: "Author is required." }),
});

// Output Schemas
export const InteractionOutputSchema = z.object({
  interaction: InteractionSchema,
});

// Types
export type InteractionAction = (typeof InteractionActions)[number];
export type ActionTarget = (typeof ActionTargets)[number];
export type InteractionDTO = z.infer<typeof InteractionSchema>;
export type CreateInteractionInput = z.infer<typeof CreateInteractionSchema>;
export type InteractionOutput = z.infer<typeof InteractionOutputSchema>;
