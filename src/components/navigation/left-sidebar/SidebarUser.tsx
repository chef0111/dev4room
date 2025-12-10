"use client";

import Link from "next/link";
import Image from "next/image";
import { UserNav } from "@/components/modules/profile/UserNav";
import { Button, Skeleton } from "@/components/ui";
import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";

const SidebarUser = () => {
  const { data } = authClient.useSession();
  const user = data?.user;
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col gap-3">
      {user ? (
        <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg" />}>
          <UserNav isAdmin={isAdmin} />
        </Suspense>
      ) : (
        <>
          <Button
            className="btn-secondary no-focus min-h-10 w-full rounded-lg px-4 py-3 hover:bg-light700_dark300! transition-all duration-200 cursor-pointer"
            asChild
          >
            <Link href="/login" className="flex-center">
              <Image
                src="/icons/account.svg"
                alt="Account"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient small-medium max-lg:hidden">
                Log in
              </span>
            </Link>
          </Button>

          <Button
            className="btn-tertiary no-focus light-border-2 min-h-10 w-full rounded-lg border px-4 py-3 hover:bg-light600_dark400! transition-all duration-200 cursor-pointer shadow-none"
            asChild
          >
            <Link href="/register" className="flex-center">
              <Image
                src="/icons/sign-up.svg"
                alt="Sign Up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="text-dark400_light900 small-medium max-lg:hidden">
                Register
              </span>
            </Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default SidebarUser;
