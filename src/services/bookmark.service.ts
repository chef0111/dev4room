"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/lib/orpc";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface UseBookmarkOptions {
  questionId: string;
}

export function useBookmark({ questionId }: UseBookmarkOptions) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const statusQueryKey = orpc.collection.status.queryOptions({
    input: { questionId },
  }).queryKey;

  const { data: bookmarkStatus } = useQuery({
    ...orpc.collection.status.queryOptions({
      input: { questionId },
    }),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => client.collection.toggle({ questionId }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey });

      const prevStatus = queryClient.getQueryData<{ saved: boolean }>(
        statusQueryKey,
      );
      const newSaved = !prevStatus?.saved;

      queryClient.setQueryData(statusQueryKey, { saved: newSaved });

      if (prevStatus?.saved) {
        toast.success("Question removed from your collection.");
      } else {
        toast.success("Question saved to your collection.");
      }

      return { prevStatus };
    },

    onError: (_error, _vars, context) => {
      if (context?.prevStatus) {
        queryClient.setQueryData(statusQueryKey, context.prevStatus);
      }
      toast.error("Failed to save question. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const isSaved = bookmarkStatus?.saved ?? false;

  const toggleBookmark = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to save questions", {
        description: "Only logged in users can save questions.",
      });
      return;
    }
    if (bookmarkMutation.isPending) return;
    bookmarkMutation.mutate();
  }, [isAuthenticated, bookmarkMutation]);

  return {
    isSaved,
    toggleBookmark,
    isLoading: bookmarkMutation.isPending,
    isAuthenticated,
  };
}
