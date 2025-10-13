"use client";

import z from "zod";
import { useRouter } from "next/navigation";
import { ForgotPasswordSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";

import AuthForm from "@/components/layout/auth/AuthForm";
import Link from "next/link";
import routes from "@/common/constants/routes";

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();
  const handleForgotPassword = async ({
    email,
  }: ForgotPasswordValues): Promise<ActionResponse> => {
    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (data) {
        router.push(
          `${routes.verifyEmail}?type=forget-password&email=${encodeURIComponent(
            email
          )}`
        );
        router.refresh();
      }

      return {
        success: !!data,
        error: { message: error?.message },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:min-w-104">
      <div className="flex-center flex-col text-center space-y-1">
        <h1 className="md:h2-bold h3-bold text-dark100_light900">
          Forgot Password
        </h1>
        <p className="md:pg-regular body-regular text-dark500_light400">
          Enter your email below to reset your password
        </p>
      </div>

      <AuthForm
        schema={ForgotPasswordSchema}
        defaultValues={{ email: "" }}
        formType="FORGOT_PASSWORD"
        onSubmit={handleForgotPassword}
      />

      <Link
        href={routes.login}
        className="text-center pg-semibold text-link-100 hover:underline transition-all cursor-pointer"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default ForgotPassword;
