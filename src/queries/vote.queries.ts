"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/lib/orpc";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export type VoteType = "upvote" | "downvote";
export type TargetType = "question" | "answer";

export interface VoteState {
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface UseVoteOptions {
  targetType: TargetType;
  targetId: string;
  initialUpvotes: number;
  initialDownvotes: number;
}

function getOptimisticState(
  voteType: VoteType,
  currentState: VoteState
): VoteState {
  const { upvotes, downvotes, hasUpvoted, hasDownvoted } = currentState;
  const isUpvote = voteType === "upvote";
  const isToggleOff = isUpvote ? hasUpvoted : hasDownvoted;
  const isSwitch = isUpvote ? hasDownvoted : hasUpvoted;

  return {
    upvotes: upvotes + (isUpvote ? (isToggleOff ? -1 : 1) : isSwitch ? -1 : 0),
    downvotes:
      downvotes + (isUpvote ? (isSwitch ? -1 : 0) : isToggleOff ? -1 : 1),
    hasUpvoted: isUpvote && !isToggleOff,
    hasDownvoted: !isUpvote && !isToggleOff,
  };
}

export function useVote({
  targetType,
  targetId,
  initialUpvotes,
  initialDownvotes,
}: UseVoteOptions) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const statusQueryKey = orpc.vote.status.queryOptions({
    input: { targetId, targetType },
  }).queryKey;

  const { data: voteData } = useQuery({
    ...orpc.vote.status.queryOptions({
      input: { targetId, targetType },
    }),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const voteMutation = useMutation({
    mutationFn: (voteType: VoteType) =>
      client.vote.create({ targetId, targetType, voteType }),

    onMutate: async (voteType) => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey });

      const prevData = queryClient.getQueryData<VoteState>(statusQueryKey);

      // Optimistic update using current state
      const currentState: VoteState = {
        upvotes: prevData?.upvotes ?? initialUpvotes,
        downvotes: prevData?.downvotes ?? initialDownvotes,
        hasUpvoted: prevData?.hasUpvoted ?? false,
        hasDownvoted: prevData?.hasDownvoted ?? false,
      };

      const optimisticState = getOptimisticState(voteType, currentState);
      queryClient.setQueryData(statusQueryKey, optimisticState);

      return { prevData };
    },

    onSuccess: (data) => {
      queryClient.setQueryData(statusQueryKey, {
        upvotes: data.upvotes,
        downvotes: data.downvotes,
        hasUpvoted: data.hasUpvoted,
        hasDownvoted: data.hasDownvoted,
      });
    },

    onError: (_error, _voteType, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(statusQueryKey, context.prevData);
      }

      toast.error("Failed to vote. Please try again.");
    },
  });

  const state = useMemo<VoteState>(
    () => ({
      upvotes: voteData?.upvotes ?? initialUpvotes,
      downvotes: voteData?.downvotes ?? initialDownvotes,
      hasUpvoted: voteData?.hasUpvoted ?? false,
      hasDownvoted: voteData?.hasDownvoted ?? false,
    }),
    [voteData, initialUpvotes, initialDownvotes]
  );

  const vote = useCallback(
    (type: VoteType) => {
      if (!isAuthenticated) {
        toast.error("Please log in to vote", {
          description: "Only logged in users can vote.",
        });
        return;
      }
      if (voteMutation.isPending) return;
      voteMutation.mutate(type);
    },
    [isAuthenticated, voteMutation]
  );

  return { state, vote, isVoting: voteMutation.isPending, isAuthenticated };
}
