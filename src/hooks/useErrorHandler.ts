"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import {
  isNetworkError,
  isAuthError,
  getErrorDetails,
  logError,
} from "@/errors/error-utils";

export type ErrorType = "network" | "auth" | "permission" | "unknown";

interface HandleErrorOptions {
  context?: string;
  showToast?: boolean;
  onNetworkError?: () => void;
  onAuthError?: () => void;
}

export function useErrorHandler() {
  const handleError = useCallback(
    (error: unknown, options: HandleErrorOptions = {}): ErrorType => {
      const {
        context,
        showToast = true,
        onNetworkError,
        onAuthError,
      } = options;

      logError(error, { context });

      if (isNetworkError(error)) {
        if (showToast) {
          toast.error("Network Error", {
            description: "Please check your internet connection and try again.",
          });
        }
        onNetworkError?.();
        return "network";
      }

      if (isAuthError(error)) {
        if (showToast) {
          toast.error("Authentication Required", {
            description: "Please log in to continue.",
          });
        }
        onAuthError?.();
        return "auth";
      }

      // Get error details for other errors
      const details = getErrorDetails(error);

      if (showToast) {
        toast.error(details.title, {
          description: details.message,
        });
      }

      return "unknown";
    },
    []
  );

  return { handleError };
}

export function handleMutationError(
  error: unknown,
  context?: string
): ErrorType {
  logError(error, { context });

  if (isNetworkError(error)) {
    toast.error("Network Error", {
      description: "Please check your internet connection and try again.",
    });
    return "network";
  }

  if (isAuthError(error)) {
    toast.error("Authentication Required", {
      description: "Your session may have expired. Please log in again.",
    });
    return "auth";
  }

  const details = getErrorDetails(error);
  toast.error(details.title, {
    description: details.message,
  });

  return "unknown";
}
