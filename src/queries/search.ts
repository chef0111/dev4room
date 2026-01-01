"use client";

import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export function useSearchMutation() {
  return useMutation({
    mutationFn: async (searchQuery: string) => {
      if (searchQuery.length < 2) return null;
      return orpc.search.call({ query: searchQuery, limit: 5 });
    },
  });
}
