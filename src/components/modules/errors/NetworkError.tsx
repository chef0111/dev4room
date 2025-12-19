"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { RefreshCw, Home, WifiOff } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface NetworkErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function NetworkError({
  title = "Connection Failed",
  message = "Unable to connect to the server. Please check your internet connection and try again.",
  onRetry,
}: NetworkErrorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-125 w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="relative mb-8 h-64 w-64">
          <Image
            src={isDark ? "/images/error-dark.svg" : "/images/error-light.svg"}
            alt="Network error"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div
          className={`mb-4 flex items-center gap-2 rounded-full px-4 py-2 ${
            isOnline
              ? "bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200"
              : "bg-destructive/10 text-destructive dark:bg-destructive/20"
          }`}
        >
          <WifiOff className="size-4" />
          <span className="small-semibold">
            {isOnline ? "Reconnected" : "Offline"}
          </span>
        </div>

        <h2 className="text-dark100_light900 h2-bold mb-4">{title}</h2>
        <p className="text-dark400_light700 body-medium mb-8 max-w-sm">
          {message}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={handleRetry}
            disabled={!isOnline}
            className="primary-gradient hover:primary-gradient-hover gap-2 disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>

          <Button variant="outline" size="lg" asChild className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
