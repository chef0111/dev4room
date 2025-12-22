"use client";

import { useState, useEffect } from "react";
import z from "zod";
import { useRouter, useSearchParams, redirect } from "next/navigation";
import { OTPSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";
import { toast } from "sonner";

import OTPForm from "@/components/modules/auth/otp-form";
import { Button } from "@/components/ui/button";

type OTPValues = z.infer<typeof OTPSchema>;

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const type = searchParams.get("type") as EmailOtpType;
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (!email || !type) {
    redirect("/login");
  }

  const handleVerifyEmail = async ({
    otp,
  }: OTPValues): Promise<ActionResponse> => {
    try {
      const { data, error } = await authClient.emailOtp.checkVerificationOtp({
        email,
        type,
        otp,
      });

      const success = !!data;
      if (success && type === "email-verification") {
        const storedPassword = sessionStorage.getItem("_verify_auth");
        if (storedPassword) {
          sessionStorage.removeItem("_verify_auth");
          const signInResult = await authClient.signIn.email({
            email,
            password: storedPassword,
          });
          if (signInResult.data?.user) {
            toast.success("Success", {
              description: "Email verified! Logging you in...",
            });
            return { success: true, handled: true };
          }
        }
      } else if (success && type === "forget-password") {
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&id=${encodeURIComponent(otp)}`
        );
      }

      return {
        success,
        error: { message: error?.message },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  const handleResendOTP = async (
    type: "email-verification" | "forget-password"
  ) => {
    if (!email) {
      toast.error("Error", {
        description: "Email address not found. Please try again.",
      });
      return;
    }

    setIsResending(true);
    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type,
      });

      if (data) {
        toast.success("Success", {
          description: "Verification code sent! Please check your email.",
        });
      } else {
        toast.error("Error", {
          description: error?.message || "Failed to send verification code.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send verification code. Please try again.",
      });
      return handleError(error) as ErrorResponse;
    } finally {
      setIsResending(false);
      setCountdown(RESEND_COOLDOWN); // Reset countdown after sending
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:min-w-md">
      <div className="flex-center flex-col space-y-1 text-center">
        <h1 className="md:h2-bold h3-bold text-dark100_light900">
          Verify Email
        </h1>
        <p className="md:pg-regular body-regular text-dark500_light400">
          We sent a 6-digit code to your email
        </p>
      </div>

      <OTPForm
        onSubmit={handleVerifyEmail}
        successMessage="Email verified successfully!"
      />

      <div className="flex-center text-dark500_light400 w-full px-0">
        Didn&apos;t receive the code?
        <Button
          type="button"
          variant="link"
          disabled={isResending || countdown > 0}
          onClick={() => handleResendOTP(type)}
          className="pg-semibold text-link-100 cursor-pointer px-1 text-center transition-all hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending
            ? "Sending..."
            : countdown > 0
              ? `Resend (${countdown}s)`
              : "Resend"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
