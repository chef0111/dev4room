"use client";

import { Route } from "next";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

interface UseCreateQuestionOptions {
  onFormReset?: () => void;
  onEditorReset?: () => void;
  onPending?: () => void;
}

export function useCreateQuestion(options?: UseCreateQuestionOptions) {
  const router = useRouter();

  return useMutation(
    orpc.questions.create.mutationOptions({
      onSuccess: (data) => {
        if (data.status === "pending") {
          options?.onPending?.();
        } else {
          toast.success("Question created successfully!");
        }
        options?.onFormReset?.();
        options?.onEditorReset?.();
        if (data.status === "approved") {
          router.push(`/questions/${data.id}`);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create question");
      },
    })
  );
}

interface UseEditQuestionOptions {
  onFormReset?: () => void;
  onEditorReset?: () => void;
}

export function useEditQuestion(options?: UseEditQuestionOptions) {
  const router = useRouter();

  return useMutation(
    orpc.questions.edit.mutationOptions({
      onSuccess: (data) => {
        toast.success("Question updated successfully!");
        options?.onFormReset?.();
        options?.onEditorReset?.();
        if (data.status === "pending") {
          router.push("/pending-questions");
        } else {
          router.push(`/questions/${data.id}`);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update question");
      },
    })
  );
}

interface UseDeleteQuestionOptions {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function useDeleteQuestion(options?: UseDeleteQuestionOptions) {
  const router = useRouter();

  return useMutation(
    orpc.questions.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Question deleted successfully");
        if (options?.redirectTo) {
          router.push(options.redirectTo as Route);
        }
        router.refresh();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete question");
      },
    })
  );
}

export function useCancelPendingQuestion() {
  const router = useRouter();

  return useMutation(
    orpc.questions.pending.cancel.mutationOptions({
      onSuccess: () => {
        toast.success("Question cancelled successfully");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to cancel question");
      },
    })
  );
}

export function useCheckDuplicateQuestion() {
  return useMutation(orpc.questions.checkDuplicate.mutationOptions());
}
