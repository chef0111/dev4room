"use client";

import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isNetworkError, isAuthError } from "@/errors/error-utils";

export function useUploadAvatar(options?: { onSuccess?: () => void }) {
  const router = useRouter();

  const getUrlMutation = useMutation(
    orpc.upload.getUrl.mutationOptions({
      onError: (error) => {
        if (isNetworkError(error)) {
          toast.error("Network Error", {
            description: "Please check your internet connection and try again.",
          });
        } else if (isAuthError(error)) {
          toast.error("Authentication Required", {
            description: "Please log in to upload files.",
          });
        } else {
          toast.error(error.message || "Failed to get upload URL");
        }
      },
    })
  );

  const confirmUploadMutation = useMutation(
    orpc.upload.confirm.mutationOptions({
      onSuccess: () => {
        toast.success("Profile picture updated successfully");
        router.refresh();
        options?.onSuccess?.();
      },
      onError: (error) => {
        if (isNetworkError(error)) {
          toast.error("Network Error", {
            description: "Upload confirmation failed. Please try again.",
          });
        } else if (isAuthError(error)) {
          toast.error("Authentication Required", {
            description: "Your session may have expired. Please log in again.",
          });
        } else {
          toast.error(error.message || "Failed to update profile picture");
        }
      },
    })
  );

  const uploadAvatar = async (file: File) => {
    try {
      // Get presigned URL from server
      const { uploadUrl, publicUrl } = await getUrlMutation.mutateAsync({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      await confirmUploadMutation.mutateAsync({ imageUrl: publicUrl });
    } catch (error) {
      // Check if it's a network error during S3 upload
      if (isNetworkError(error)) {
        toast.error("Upload Failed", {
          description: "Network error during file upload. Please try again.",
        });
      }
      throw error;
    }
  };

  return {
    uploadAvatar,
    isUploading: getUrlMutation.isPending || confirmUploadMutation.isPending,
    error: getUrlMutation.error || confirmUploadMutation.error,
  };
}

export function useRemoveAvatar(options?: { onSuccess?: () => void }) {
  const router = useRouter();

  return useMutation(
    orpc.upload.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Profile picture removed");
        router.refresh();
        options?.onSuccess?.();
      },
      onError: (error) => {
        if (isNetworkError(error)) {
          toast.error("Network Error", {
            description: "Please check your connection and try again.",
          });
        } else if (isAuthError(error)) {
          toast.error("Authentication Required", {
            description: "Please log in to remove your profile picture.",
          });
        } else {
          toast.error(error.message || "Failed to remove profile picture");
        }
      },
    })
  );
}
