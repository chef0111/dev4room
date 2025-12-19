"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { logError, getErrorDetails } from "@/errors/error-utils";
import { ThemeProvider } from "@/context/theme-provider";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logError(error, {
      digest: error.digest,
      page: "global-error-boundary",
      severity: "critical",
    });
  }, [error]);

  const errorDetails = getErrorDetails(error);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-light850_dark100 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex min-h-screen items-center justify-center">
            <ErrorFallback
              title={errorDetails.title}
              message={errorDetails.message}
              showResetButton
              showHomeButton
              onReset={reset}
            />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
