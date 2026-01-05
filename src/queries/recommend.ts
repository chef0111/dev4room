"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

const DEFAULT_LIMIT = 5;

export function useTopQuestions(enabled: boolean = true) {
  return useQuery({
    ...orpc.questions.getTop.queryOptions({
      input: { limit: DEFAULT_LIMIT },
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function usePopularTags(enabled: boolean = true) {
  return useQuery({
    ...orpc.tags.getPopular.queryOptions({
      input: { limit: DEFAULT_LIMIT },
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
