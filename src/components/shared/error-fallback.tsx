"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showResetButton?: boolean;
  onReset?: () => void;
  className?: string;
}

export function ErrorFallback({
  title = "Something Went Wrong",
  message = "We encountered an unexpected error. Please try again.",
  showHomeButton = true,
  showBackButton = false,
  showResetButton = false,
  onReset,
  className,
}: ErrorFallbackProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-125 w-full flex-col items-center justify-center px-4 py-12",
        className
      )}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Error Illustration */}
        <div className="relative mb-8 h-64 w-64">
          <Image
            src={isDark ? "/images/error-dark.svg" : "/images/error-light.svg"}
            alt="Error illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Error Title */}
        <h2 className="text-dark100_light900 h2-bold mb-4">{title}</h2>

        {/* Error Message */}
        <p className="text-dark400_light700 body-medium mb-8 max-w-sm">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {showBackButton && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
          )}

          {showResetButton && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          )}

          {showHomeButton && (
            <Button
              asChild
              size="lg"
              className="primary-gradient hover:primary-gradient-hover gap-2"
            >
              <Link href="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
