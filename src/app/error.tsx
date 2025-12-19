"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { logError, getErrorDetails } from "@/lib/error-utils";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for route segments
 * Catches runtime errors and provides recovery mechanism
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error when component mounts
    logError(error, {
      digest: error.digest,
      page: "root-error-boundary",
    });
  }, [error]);

  const errorDetails = getErrorDetails(error);

  return (
    <main className="bg-light850_dark100 flex min-h-screen items-center justify-center">
      <ErrorFallback
        title={errorDetails.title}
        message={errorDetails.message}
        showResetButton
        showHomeButton
        onReset={reset}
      />
    </main>
  );
}
