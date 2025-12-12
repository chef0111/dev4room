"use client";

import { Route } from "next";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

interface UseCreateQuestionOptions {
  onFormReset?: () => void;
  onEditorReset?: () => void;
}

export function useCreateQuestion(options?: UseCreateQuestionOptions) {
  const router = useRouter();

  return useMutation(
    orpc.question.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Question created successfully!");
        options?.onFormReset?.();
        options?.onEditorReset?.();
        router.push(`/questions/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create question");
      },
    }),
  );
}

interface UseEditQuestionOptions {
  onFormReset?: () => void;
  onEditorReset?: () => void;
}

export function useEditQuestion(options?: UseEditQuestionOptions) {
  const router = useRouter();

  return useMutation(
    orpc.question.edit.mutationOptions({
      onSuccess: (data) => {
        toast.success("Question updated successfully!");
        options?.onFormReset?.();
        options?.onEditorReset?.();
        router.push(`/questions/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update question");
      },
    }),
  );
}

interface UseDeleteQuestionOptions {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function useDeleteQuestion(options?: UseDeleteQuestionOptions) {
  const router = useRouter();

  return useMutation(
    orpc.question.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Question deleted successfully");
        options?.onSuccess?.();
        if (options?.redirectTo) {
          router.push(options.redirectTo as Route);
        }
        router.refresh();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete question");
      },
    }),
  );
}
