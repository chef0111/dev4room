"use client";

import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export function useGenerateAnswer() {
  return useMutation(orpc.ai.generateAnswer.mutationOptions());
}
