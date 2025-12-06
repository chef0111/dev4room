"use client";

import { useCallback, useMemo, useState } from "react";
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

function getVoteChanges(
  voteType: VoteType,
  hasUpvoted: boolean,
  hasDownvoted: boolean,
) {
  const isUpvote = voteType === "upvote";
  const isToggleOff = isUpvote ? hasUpvoted : hasDownvoted;
  const isSwitch = isUpvote ? hasDownvoted : hasUpvoted;

  return {
    upvotes: isUpvote ? (isToggleOff ? -1 : 1) : isSwitch ? -1 : 0,
    downvotes: isUpvote ? (isSwitch ? -1 : 0) : isToggleOff ? -1 : 1,
    newUpvoted: isUpvote && !isToggleOff,
    newDownvoted: !isUpvote && !isToggleOff,
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

  const [countChange, setCountChange] = useState({ upvotes: 0, downvotes: 0 });

  const statusQueryKey = orpc.vote.status.queryOptions({
    input: { targetId, targetType },
  }).queryKey;

  const { data: voteStatus } = useQuery({
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

      const prevStatus = queryClient.getQueryData<{
        hasUpvoted: boolean;
        hasDownvoted: boolean;
      }>(statusQueryKey);
      const prevChange = countChange;

      const hasUpvoted = prevStatus?.hasUpvoted ?? false;
      const hasDownvoted = prevStatus?.hasDownvoted ?? false;

      const changes = getVoteChanges(voteType, hasUpvoted, hasDownvoted);

      setCountChange((prev) => ({
        upvotes: prev.upvotes + changes.upvotes,
        downvotes: prev.downvotes + changes.downvotes,
      }));

      queryClient.setQueryData(statusQueryKey, {
        hasUpvoted: changes.newUpvoted,
        hasDownvoted: changes.newDownvoted,
      });

      return { prevStatus, prevChange };
    },

    onError: (_error, _voteType, context) => {
      // Rollback
      if (context?.prevStatus) {
        queryClient.setQueryData(statusQueryKey, context.prevStatus);
      }
      if (context?.prevChange) {
        setCountChange(context.prevChange);
      }
      toast.error("Failed to vote. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const state = useMemo<VoteState>(
    () => ({
      upvotes: initialUpvotes + countChange.upvotes,
      downvotes: initialDownvotes + countChange.downvotes,
      hasUpvoted: voteStatus?.hasUpvoted ?? false,
      hasDownvoted: voteStatus?.hasDownvoted ?? false,
    }),
    [voteStatus, initialUpvotes, initialDownvotes, countChange],
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
    [isAuthenticated, voteMutation],
  );

  return { state, vote, isVoting: voteMutation.isPending, isAuthenticated };
}
