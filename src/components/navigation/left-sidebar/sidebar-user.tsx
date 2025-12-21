"use client";

import Link from "next/link";
import Image from "next/image";
import { UserNav } from "@/components/modules/profile/user-nav";
import { Button, Skeleton } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

const SidebarUser = () => {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col gap-3">
      {isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : user ? (
        <UserNav isAdmin={isAdmin} />
      ) : (
        <>
          <Button
            className="btn-secondary no-focus hover:bg-light700_dark300! min-h-10 w-full cursor-pointer rounded-lg px-4 py-3 transition-all duration-200"
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
            className="btn-tertiary no-focus light-border-2 hover:bg-light600_dark400! min-h-10 w-full cursor-pointer rounded-lg border px-4 py-3 shadow-none transition-all duration-200"
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
