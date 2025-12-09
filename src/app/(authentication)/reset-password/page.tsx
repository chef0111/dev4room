"use client";

import z from "zod";
import { ResetPasswordSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";

import AuthForm from "@/components/modules/auth/AuthForm";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const id = searchParams.get("id") as string;

  if (!email || !id) {
    return (
      <div className="flex flex-col gap-2 text-center sm:max-w-104">
        <div className="w-full flex-center">
          <Image
            src="/images/error-dark.png"
            alt="Invalid Link"
            width={270}
            height={200}
            className="hidden object-contain dark:block"
          />
          <Image
            src="/images/error-light.png"
            alt="Invalid Link"
            width={270}
            height={200}
            className="block object-contain dark:hidden"
          />
        </div>

        <h1 className="md:h2-bold h3-bold mt-2 text-dark100_light900">
          Invalid Reset Request
        </h1>
        <p className="body-regular mb-4 text-dark500_light500 text-center">
          This password reset request is invalid or has expired. Please request
          a new one.
        </p>

        <Link
          href="/forgot-password"
          className="pg-semibold text-link-100 hover:underline"
        >
          Make a new Request
        </Link>
      </div>
    );
  }

  const handleResetPassword = async ({
    password,
  }: ResetPasswordValues): Promise<ActionResponse> => {
    try {
      const { data } = await authClient.emailOtp.resetPassword({
        email,
        otp: id,
        password,
      });

      return {
        success: !!data,
        error: {
          message: "Invalid OTP. Please try again or request a new one.",
        },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:w-120">
      <div className="flex-center flex-col text-center space-y-1">
        <h1 className="md:h2-bold h3-bold text-dark100_light900">
          Reset Password
        </h1>
        <p className="md:pg-regular body-regular text-dark500_light400">
          Enter your new password below to reset your password
        </p>
      </div>

      <AuthForm
        schema={ResetPasswordSchema}
        defaultValues={{ password: "", confirmPassword: "" }}
        formType="RESET_PASSWORD"
        onSubmit={handleResetPassword}
      />
    </div>
  );
};

export default ResetPassword;
