"use client";

import { useState } from "react";
import z from "zod";
import { LoginSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import handleError from "@/lib/handlers/error";

import AuthForm from "@/components/layout/auth/AuthForm";
import SocialAuthForm from "@/components/layout/auth/SocialAuthForm";
import routes from "@/common/constants/routes";
import Link from "next/link";

type LoginValues = z.infer<typeof LoginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async ({
    email,
    password,
    rememberMe,
  }: LoginValues): Promise<ActionResponse> => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });
      setIsLoading(false);

      return { success: !!data?.user, error: { message: error?.message } };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <AuthForm
        schema={LoginSchema}
        defaultValues={{ email: "", password: "", rememberMe: false }}
        formType="LOGIN"
        onSubmit={handleLogin}
      />

      <div className="flex-center after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t after:mx-6">
        <span className="bg-light900_dark200 text-dark500_light400 relative z-10 px-2">
          Or continue with
        </span>
      </div>

      <div className="flex flex-col">
        <SocialAuthForm disabled={isLoading} />

        <div className="flex-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link
              href={routes.register}
              className="pg-semibold primary-text-gradient hover:primary-text-gradient-hover transition-all cursor-pointer"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
