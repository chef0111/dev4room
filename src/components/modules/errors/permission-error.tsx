"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Home, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionErrorProps {
  title?: string;
  message?: string;
  requiredRole?: string;
}

export function PermissionError({
  title = "Access Denied",
  message = "You don't have permission to access this resource. Please contact an administrator if you believe this is an error.",
  requiredRole,
}: PermissionErrorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const displayMessage = requiredRole
    ? `This page requires ${requiredRole} access. ${message}`
    : message;

  return (
    <div className="flex min-h-125 w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Error Illustration */}
        <div className="relative mb-8 h-64 w-64">
          <Image
            src={isDark ? "/images/error-dark.svg" : "/images/error-light.svg"}
            alt="Permission denied"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-destructive/10 text-destructive mb-4 flex size-16 items-center justify-center rounded-full">
          <ShieldAlert className="size-8" />
        </div>

        <h2 className="text-dark100_light900 h2-bold mb-4">{title}</h2>
        <p className="text-dark400_light700 body-medium mb-8 max-w-sm">
          {displayMessage}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>

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
        </div>
      </div>
    </div>
  );
}
