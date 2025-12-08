import { after } from "next/server";
import { authorized } from "@/app/middleware/auth";
import {
  createVote as createVoteDAL,
  hasVoted as hasVotedDAL,
} from "./vote.dal";
import {
  CreateVoteSchema,
  HasVotedSchema,
  VoteOutputSchema,
  HasVotedOutputSchema,
} from "./vote.dto";
import { createInteraction } from "../interaction/interaction.dal";

export const createVote = authorized
  .route({
    method: "POST",
    path: "/vote",
    summary: "Create or Toggle Vote",
    description:
      "Create a new vote, toggle off existing vote, or change vote type",
    tags: ["Votes"],
  })
  .input(CreateVoteSchema)
  .output(VoteOutputSchema)
  .handler(async ({ input, context }) => {
    const { contentAuthorId, ...result } = await createVoteDAL(
      input,
      context.user.id,
    );

    after(async () => {
      try {
        await createInteraction(
          {
            action: input.voteType,
            actionType: input.targetType,
            actionId: input.targetId,
            authorId: contentAuthorId,
          },
          context.user.id,
        );
      } catch (error) {
        console.error("Failed to create interaction after vote:", error);
      }
    });

    return result;
  });

export const hasVoted = authorized
  .route({
    method: "GET",
    path: "/vote/status",
    summary: "Check Vote Status",
    description: "Check if the current user has voted on a target",
    tags: ["Votes"],
  })
  .input(HasVotedSchema)
  .output(HasVotedOutputSchema)
  .handler(async ({ input, context }) => {
    const result = await hasVotedDAL(input, context.user.id);
    return result;
  });
