"use client";

import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateProfile(options?: { onSuccess?: () => void }) {
  const router = useRouter();

  return useMutation(
    orpc.user.update.mutationOptions({
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
