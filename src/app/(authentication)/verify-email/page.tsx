"use client";

import { useState } from "react";
import z from "zod";
import { useSearchParams } from "next/navigation";
import { OTPSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";
import { toast } from "sonner";

import routes from "@/common/constants/routes";
import OTPForm from "@/components/layout/auth/OtpForm";
import { Button } from "@/components/ui/button";

type OTPValues = z.infer<typeof OTPSchema>;

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || undefined;
  const [isResending, setIsResending] = useState(false);

  const handleVerifyEmail = async ({
    otp,
  }: OTPValues): Promise<ActionResponse> => {
    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: email as string,
        otp,
      });

      return {
        success: !!data,
        error: { message: error?.message },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Error", {
        description: "Email address not found. Please try registering again.",
      });
      return;
    }

    setIsResending(true);
    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "email-verification",
      });

      if (data) {
        toast.success("Success", {
          description: "Verification code sent! Check your email.",
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
    <div className="flex flex-col gap-4 sm:min-w-104">
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
        successMessage="Email verified successfully! You can now log in."
        redirectTo={routes.login}
      />

      <div className="flex-center w-full px-0 text-dark500_light400">
        Didn't receive the code?
        <Button
          type="button"
          variant="link"
          disabled={isResending}
          onClick={handleResendOTP}
          className="text-center pg-semibold text-link-100 hover:underline transition-all cursor-pointer px-1"
        >
          {isResending ? "Sending..." : "Resend"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
