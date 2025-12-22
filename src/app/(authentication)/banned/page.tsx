"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BannedPage = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const error = searchParams.get("error");

  const isBanned =
    error?.toLowerCase().includes("banned") ||
    error?.toLowerCase().includes("suspended") ||
    true;

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <CardHeader className="flex flex-col items-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <ShieldX className="size-8 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-dark100_light900 text-2xl">
          Account Suspended
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-dark500_light400">
          Your account has been suspended and you cannot access this platform.
        </p>

        {reason && (
          <div className="rounded-md bg-red-50 p-4 text-left text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-semibold">Reason:</p>
            <p>{reason}</p>
          </div>
        )}

        {error && !isBanned && (
          <div className="rounded-md bg-yellow-50 p-4 text-left text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <p className="text-dark500_light400 text-sm">
          If you believe this is a mistake, please contact support.
        </p>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          asChild
          variant="outline"
          className="text-dark300_light700 light-border-2! hover:bg-light700_dark300 border-[0.1rem]"
        >
          <Link href="/login">Return to Login</Link>
        </Button>
      </CardFooter>
    </div>
  );
};

export default BannedPage;
