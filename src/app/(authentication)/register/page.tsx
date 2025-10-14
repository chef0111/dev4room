"use client";

import { useState } from "react";
import z from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { RegisterSchema } from "@/lib/validations";
import AuthForm from "@/components/layout/auth/AuthForm";
import SocialAuthForm from "@/components/layout/auth/SocialAuthForm";
import Link from "next/link";
import routes from "@/common/constants/routes";
import handleError from "@/lib/handlers/error";

type RegisterValues = z.infer<typeof RegisterSchema>;

const Register = () => {
  const router = useRouter();
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
        callbackURL: "/verify-email",
      });

      setIsLoading(false);

      if (data?.user) {
        router.push(
          `${routes.verifyEmail}?type=email-verification&email=${encodeURIComponent(
            email
          )}`
        );
        router.refresh();
      }

      return {
        success: !!data?.user,
        error: { message: error?.message },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:w-120">
      <div className="flex-center flex-col text-center space-y-1">
        <h1 className="md:h2-bold h3-bold text-dark100_light900">
          Create an account
        </h1>
        <p className="md:pg-regular body-regular text-dark500_light400">
          Enter your information below to join Dev4Room
        </p>
      </div>

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

      <div className="flex-center my-1 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t">
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
              className="pg-semibold text-link-100 hover:underline transition-all cursor-pointer"
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
