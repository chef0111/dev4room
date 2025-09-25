"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SocialAuthForm = () => {
  const handleLogIn = async (provider: "google" | "github") => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2.5 w-full">
      <Button className="btn-social" onClick={() => handleLogIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="mr-1 object-contain"
        />
        <span>Log in with Google</span>
      </Button>

      <Button className="btn-social" onClick={() => handleLogIn("github")}>
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
