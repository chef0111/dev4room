"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/lib/orpc";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Types
export type VoteType = "upvote" | "downvote";
export type TargetType = "question" | "answer";

export interface VoteStatus {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

export interface VoteCounts {
  upvotes: number;
  downvotes: number;
}

export interface VoteState extends VoteStatus, VoteCounts {}

interface OptimisticContext {
  previousStatus: VoteStatus | undefined;
  previousCounts: VoteCounts | undefined;
}

interface UseVoteOptions {
  targetType: TargetType;
  targetId: string;
  initialUpvotes: number;
  initialDownvotes: number;
}

export const voteQueryKeys = {
  status: (targetType: TargetType, targetId: string) =>
    orpc.vote.status.queryOptions({
      input: { targetId, targetType },
    }).queryKey,
  counts: (targetType: TargetType, targetId: string) =>
    ["vote", "counts", targetType, targetId] as const,
};

function calculateVoteState(
  voteType: VoteType,
  currentStatus: VoteStatus,
  currentCounts: VoteCounts,
): { status: VoteStatus; counts: VoteCounts } {
  const { hasUpvoted, hasDownvoted } = currentStatus;
  const { upvotes, downvotes } = currentCounts;

  if (voteType === "upvote") {
    if (hasUpvoted) {
      return {
        status: { hasUpvoted: false, hasDownvoted: false },
        counts: { upvotes: upvotes - 1, downvotes },
      };
    } else if (hasDownvoted) {
      return {
        status: { hasUpvoted: true, hasDownvoted: false },
        counts: { upvotes: upvotes + 1, downvotes: downvotes - 1 },
      };
    } else {
      return {
        status: { hasUpvoted: true, hasDownvoted: false },
        counts: { upvotes: upvotes + 1, downvotes },
      };
    }
  } else {
    if (hasDownvoted) {
      return {
        status: { hasUpvoted: false, hasDownvoted: false },
        counts: { upvotes, downvotes: downvotes - 1 },
      };
    } else if (hasUpvoted) {
      return {
        status: { hasUpvoted: false, hasDownvoted: true },
        counts: { upvotes: upvotes - 1, downvotes: downvotes + 1 },
      };
    } else {
      return {
        status: { hasUpvoted: false, hasDownvoted: true },
        counts: { upvotes, downvotes: downvotes + 1 },
      };
    }
  }
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

  const statusQueryKey = voteQueryKeys.status(targetType, targetId);
  const countsQueryKey = voteQueryKeys.counts(targetType, targetId);

  // Only fetch vote status if authenticated
  const { data: voteStatus } = useQuery({
    ...orpc.vote.status.queryOptions({
      input: { targetId, targetType },
    }),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // Local vote counts cache
  const { data: voteCounts } = useQuery({
    queryKey: countsQueryKey,
    queryFn: () => ({ upvotes: initialUpvotes, downvotes: initialDownvotes }),
    initialData: { upvotes: initialUpvotes, downvotes: initialDownvotes },
    staleTime: Infinity, // Never stale - managed optimistically
  });

  const voteMutation = useMutation({
    mutationFn: async (voteType: VoteType) => {
      return client.vote.create({
        targetId,
        targetType,
        voteType,
      });
    },

    // Optimistic update - instant UI feedback
    onMutate: async (voteType): Promise<OptimisticContext> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: statusQueryKey });
      await queryClient.cancelQueries({ queryKey: countsQueryKey });

      // Snapshot previous values for rollback
      const previousStatus =
        queryClient.getQueryData<VoteStatus>(statusQueryKey);
      const previousCounts =
        queryClient.getQueryData<VoteCounts>(countsQueryKey);

      // Calculate new optimistic state
      const currentStatus: VoteStatus = {
        hasUpvoted: previousStatus?.hasUpvoted ?? false,
        hasDownvoted: previousStatus?.hasDownvoted ?? false,
      };
      const currentCounts: VoteCounts = {
        upvotes: previousCounts?.upvotes ?? initialUpvotes,
        downvotes: previousCounts?.downvotes ?? initialDownvotes,
      };

      const { status: newStatus, counts: newCounts } = calculateVoteState(
        voteType,
        currentStatus,
        currentCounts,
      );

      // Optimistically update both caches
      queryClient.setQueryData<VoteStatus>(statusQueryKey, newStatus);
      queryClient.setQueryData<VoteCounts>(countsQueryKey, newCounts);

      return { previousStatus, previousCounts };
    },

    // Rollback on error
    onError: (_error, _voteType, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData<VoteStatus>(
          statusQueryKey,
          context.previousStatus,
        );
      }
      if (context?.previousCounts) {
        queryClient.setQueryData<VoteCounts>(
          countsQueryKey,
          context.previousCounts,
        );
      }
      toast.error("Failed to vote. Please try again.");
    },

    // Sync with server after mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const state = useMemo<VoteState>(
    () => ({
      upvotes: voteCounts?.upvotes ?? initialUpvotes,
      downvotes: voteCounts?.downvotes ?? initialDownvotes,
      hasUpvoted: voteStatus?.hasUpvoted ?? false,
      hasDownvoted: voteStatus?.hasDownvoted ?? false,
    }),
    [voteStatus, voteCounts, initialUpvotes, initialDownvotes],
  );

  // Avoid votes spamming and require authentication
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

  return {
    state,
    vote,
    isVoting: voteMutation.isPending,
    isAuthenticated,
  };
}
