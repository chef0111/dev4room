"use client";

import z from "zod";
import { ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";

import AuthForm from "@/components/layout/auth/AuthForm";
import routes from "@/common/constants/routes";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const handleResetPassword = async ({
    password,
  }: ResetPasswordValues): Promise<ActionResponse> => {
    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      const success = !!data;

      return {
        success,
        error: { message: error?.message },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  return (
    <div className="flex flex-col gap-4">
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

      <Link
        href={routes.login}
        className="text-center pg-semibold text-link-100 hover:underline transition-all cursor-pointer"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default ResetPassword;
