"use client";

import { useState } from "react";
import z from "zod";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import { toast } from "sonner";
import handleError from "@/lib/handlers/error";
import AuthForm from "@/components/layout/auth/AuthForm";
import SocialAuthForm from "@/components/layout/auth/SocialAuthForm";
import routes from "@/common/constants/routes";
import VerifyDialog from "@/components/layout/auth/VerifyDialog";

type LoginValues = z.infer<typeof LoginSchema>;

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>("");
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const handleLogin = async ({
    email,
    password,
  }: LoginValues): Promise<ActionResponse> => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              setUnverifiedEmail(email);
              setShowVerificationDialog(true);
            }
          },
        }
      );

      setIsLoading(false);

      return {
        success: !!data?.user,
        error: { message: error?.message },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!unverifiedEmail) return;

    setIsSendingVerification(true);
    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: unverifiedEmail,
        type: "email-verification",
      });

      if (data) {
        toast.success("Success", {
          description: "Verification code sent! Check your email.",
        });
        setShowVerificationDialog(false);
        router.push(`${routes.verifyEmail}?email=${unverifiedEmail}`);
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
      setIsSendingVerification(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex-center flex-col text-center space-y-1">
          <h1 className="md:h2-bold h3-bold text-dark100_light900">
            Login to Dev4Room
          </h1>
          <p className="md:pg-regular body-regular text-dark500_light400">
            Enter your email and password to access your account
          </p>
        </div>
        <AuthForm
          schema={LoginSchema}
          defaultValues={{ email: "", password: "" }}
          formType="LOGIN"
          onSubmit={handleLogin}
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
              Don't have an account?{" "}
              <Link
                href={routes.register}
                className="pg-semibold text-link-100 hover:underline transition-all cursor-pointer"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      <VerifyDialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
        action={isSendingVerification}
        onAction={handleSendVerificationEmail}
      />
    </>
  );
};

export default Login;
