"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui";
import { Route } from "next";

interface AuthErrorProps {
  title?: string;
  message?: string;
  loginPath?: string;
}

export function AuthError({
  title = "Authentication Required",
  message = "You need to be signed in to access this page. Please log in to continue.",
  loginPath = "/login",
}: AuthErrorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex min-h-125 w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Error Illustration */}
        <div className="relative mb-8 h-64 w-64">
          <Image
            src={isDark ? "/images/error-dark.svg" : "/images/error-light.svg"}
            alt="Authentication error"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-dark100_light900 h2-bold mb-4">{title}</h2>

        {/* Message */}
        <p className="text-dark400_light700 body-medium mb-8 max-w-sm">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="primary-gradient hover:primary-gradient-hover gap-2"
          >
            <Link href={loginPath as Route}>
              <LogIn className="size-4" />
              Sign In
            </Link>
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
