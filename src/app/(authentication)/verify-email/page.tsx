"use client";

import { useState } from "react";
import z from "zod";
import { useRouter, useSearchParams, redirect } from "next/navigation";
import { OTPSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";
import { toast } from "sonner";

import routes from "@/common/constants/routes";
import OTPForm from "@/components/layout/auth/OTPForm";
import { Button } from "@/components/ui/button";

type OTPValues = z.infer<typeof OTPSchema>;

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const type = searchParams.get("type") as EmailOtpType;
  const [isResending, setIsResending] = useState(false);

  if (!email || !type) {
    redirect(routes.login);
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
        router.push(routes.login);
      } else if (success && type === "forget-password") {
        router.push(
          `${routes.resetPassword}?email=${encodeURIComponent(
            email
          )}&id=${encodeURIComponent(otp)}`
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
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:w-120">
      <div className="flex-center flex-col text-center space-y-1">
        <h1 className="md:h2-bold h3-bold text-dark100_light900">
          Verify Email
        </h1>
        <p className="md:pg-regular body-regular text-dark500_light400">
          We sent a 6-digit code to your email
        </p>
      </div>

      <OTPForm
        onSubmit={handleVerifyEmail}
        successMessage="Email verified successfully! You can now continue."
      />

      <div className="flex-center w-full px-0 text-dark500_light400">
        Didn't receive the code?
        <Button
          type="button"
          variant="link"
          disabled={isResending}
          onClick={() => handleResendOTP(type)}
          className="text-center pg-semibold text-link-100 hover:underline transition-all cursor-pointer px-1"
        >
          {isResending ? "Sending..." : "Resend"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
