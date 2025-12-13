"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

interface UseUpdateProfileOptions {
  userId: string;
  onSuccess?: () => void;
}

export function useUpdateProfile({
  userId,
  onSuccess,
}: UseUpdateProfileOptions) {
  const router = useRouter();

  return useMutation(
    orpc.user.update.mutationOptions({
      onSuccess: () => {
        toast.success("Your profile has been updated successfully.");
        onSuccess?.();
        router.push(`/profile/${userId}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    }),
  );
}
