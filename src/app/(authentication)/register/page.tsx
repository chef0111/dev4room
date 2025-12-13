"use client";

import { useState } from "react";
import z from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import { RegisterSchema } from "@/lib/validations";
import AuthForm from "@/components/modules/auth/AuthForm";
import SocialAuthForm from "@/components/modules/auth/SocialAuthForm";
import handleError from "@/lib/handlers/error";
import { Button } from "@/components/ui";

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
          `/verify-email?type=email-verification&email=${encodeURIComponent(
            email,
          )}`,
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
      <div className="flex-center flex-col space-y-1 text-center">
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

      <div className="flex-center after:border-border relative my-1 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t">
        <span className="bg-light900_dark200 text-dark500_light400 relative z-10 px-2">
          Or continue with
        </span>
      </div>

      <div className="flex flex-col">
        <SocialAuthForm disabled={isLoading} />

        <div className="flex-center pg-semibold mt-4">
          <p>
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-link-100 size-fit p-0 text-[16px]"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
