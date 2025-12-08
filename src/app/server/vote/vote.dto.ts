import "server-only";
import z from "zod";

export const VoteTypes = ["upvote", "downvote"] as const;
export const TargetTypes = ["question", "answer"] as const;

export const VoteSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  actionId: z.string(),
  actionType: z.enum(TargetTypes),
  voteType: z.enum(VoteTypes),
  createdAt: z.date(),
});

// Input Schemas
export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required." }),
  targetType: z.enum(TargetTypes, {
    message: "Invalid target type. Must be 'question' or 'answer'.",
  }),
  voteType: z.enum(VoteTypes, {
    message: "Invalid vote type. Must be 'upvote' or 'downvote'.",
  }),
});

export const HasVotedSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required." }),
  targetType: z.enum(TargetTypes, {
    message: "Invalid target type. Must be 'question' or 'answer'.",
  }),
});

// Output Schemas
export const VoteOutputSchema = z.object({
  success: z.boolean(),
  upvotes: z.number(),
  downvotes: z.number(),
  hasUpvoted: z.boolean(),
  hasDownvoted: z.boolean(),
});

export const HasVotedOutputSchema = z.object({
  hasUpvoted: z.boolean(),
  hasDownvoted: z.boolean(),
  upvotes: z.number(),
  downvotes: z.number(),
});

// Types
export type VoteType = (typeof VoteTypes)[number];
export type TargetType = (typeof TargetTypes)[number];
export type VoteDTO = z.infer<typeof VoteSchema>;
export type CreateVoteInput = z.infer<typeof CreateVoteSchema>;
export type HasVotedInput = z.infer<typeof HasVotedSchema>;
export type VoteOutput = z.infer<typeof VoteOutputSchema>;
export type HasVotedOutput = z.infer<typeof HasVotedOutputSchema>;
