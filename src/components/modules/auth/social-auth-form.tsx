"use client";

import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import Image from "next/image";

const SocialAuthForm = ({ disabled }: { disabled?: boolean }) => {
  const [isPending, startTransition] = useTransition();

  const handleSocialLogin = async (provider: "google" | "github") => {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

    startTransition(async () => {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success(`Signed in with ${providerName}, redirecting...`);
          },
          onError: () => {
            toast.error("Internal Server Error");
          },
        },
      });
    });
  };

  return (
    <div className="grid w-full grid-cols-2 gap-2.5 max-sm:grid-cols-1">
      <Button
        className="btn-social"
        disabled={disabled || isPending}
        onClick={() => handleSocialLogin("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="mr-1 object-contain"
        />
        <span>Continue with Google</span>
      </Button>

      <Button
        className="btn-social"
        disabled={disabled || isPending}
        onClick={() => handleSocialLogin("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="Github logo"
          width={20}
          height={20}
          className="invert-colors mr-1 object-contain"
        />
        <span>Continue with Github</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
