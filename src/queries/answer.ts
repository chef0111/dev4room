"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

interface UseCreateAnswerOptions {
  onFormReset?: () => void;
  onEditorReset?: () => void;
  onSuccess?: () => void;
}

export function useCreateAnswer(options?: UseCreateAnswerOptions) {
  const router = useRouter();

  return useMutation(
    orpc.answers.create.mutationOptions({
      onSuccess: () => {
        toast.success("Answer posted successfully!");
        options?.onFormReset?.();
        options?.onEditorReset?.();
        router.refresh();
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to post answer");
      },
    })
  );
}

interface UseEditAnswerOptions {
  onSuccess?: () => void;
}

export function useEditAnswer(options?: UseEditAnswerOptions) {
  const router = useRouter();

  return useMutation(
    orpc.answers.update.mutationOptions({
      onSuccess: () => {
        toast.success("Answer updated successfully!");
        router.refresh();
        options?.onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update answer");
      },
    })
  );
}

export function useDeleteAnswer() {
  const router = useRouter();

  return useMutation(
    orpc.answers.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Answer deleted successfully");
        router.refresh();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete answer");
      },
    })
  );
}
