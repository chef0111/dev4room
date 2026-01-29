"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateProfile(options?: { onSuccess?: () => void }) {
  const router = useRouter();

  return useMutation(
    orpc.users.update.mutationOptions({
      onSuccess: () => {
        toast.success("Your profile has been updated successfully.");
        router.refresh();
        options?.onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    })
  );
}

export function useContribution(userId: string, year: number) {
  return useQuery(
    orpc.users.contributions.queryOptions({
      input: { userId, year },
      placeholderData: (prevData) => prevData,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    })
  );
}
