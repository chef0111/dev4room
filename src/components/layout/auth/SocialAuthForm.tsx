"use client";

import { authClient } from "@/lib/auth-client";
import routes from "@/common/constants/routes";
import handleError from "@/lib/handlers/error";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SocialAuthForm = ({ disabled }: { disabled?: boolean }) => {
  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: routes.home,
      });
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  };

  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2.5 w-full">
      <Button
        className="btn-social"
        disabled={disabled}
        onClick={() => handleSocialLogin("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="mr-1 object-contain"
        />
        <span>Log in with Google</span>
      </Button>

      <Button
        className="btn-social"
        disabled={disabled}
        onClick={() => handleSocialLogin("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="Github logo"
          width={20}
          height={20}
          className="invert-colors mr-1 object-contain"
        />
        <span>Log in with Github</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
