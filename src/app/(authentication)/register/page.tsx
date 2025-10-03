"use client";

import { useState } from "react";
import z from "zod";
import { RegisterSchema } from "@/lib/validations";
import handleError from "@/lib/handlers/error";

import AuthForm from "@/components/layout/auth/AuthForm";
import SocialAuthForm from "@/components/layout/auth/SocialAuthForm";
import Link from "next/link";
import routes from "@/common/constants/routes";
import { authClient } from "@/lib/auth-client";

type RegisterValues = z.infer<typeof RegisterSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async ({
    name,
    username,
    email,
    password,
  }: RegisterValues): Promise<ActionResponse> => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        username,
        email,
        password,
        callbackURL: "/email-verified",
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
        schema={RegisterSchema}
        defaultValues={{
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        formType="REGISTER"
        onSubmit={handleRegister}
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
            Already have an account?{" "}
            <Link
              href={routes.login}
              className="pg-semibold primary-text-gradient hover:primary-text-gradient-hover transition-all cursor-pointer"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
