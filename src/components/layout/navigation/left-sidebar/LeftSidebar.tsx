import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "@/lib/session";
import NavTabs from "./NavTabs";
import { Button } from "@/components/ui/button";
import { UserNav } from "../../profile/UserNav";
import NavTabsFallback from "./NavTabsFallback";
import { Skeleton } from "@/components/ui/skeleton";

const LeftSidebar = async () => {
  const session = await getServerSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <div>
      <section
        role="navigation"
        aria-label="Primary"
        className="no-scrollbar bg-light900_dark200 light-border fixed left-0 top-0 h-screen  lg:w-65 flex flex-col justify-between border-r p-4 pt-32 shadow-light-300 dark:shadow-none overflow-y-auto max-sm:hidden"
      >
        <div>
          <Suspense fallback={<NavTabsFallback isMobile={false} />}>
            <NavTabs userId={user?.id} isMobile={false} />
          </Suspense>
        </div>

        <div className="flex flex-col gap-3">
          {user ? (
            <Suspense
              fallback={<Skeleton className="h-10 w-full rounded-lg" />}
            >
              <UserNav user={user} isAdmin={isAdmin} />
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
      </section>
    </div>
  );
};

export default LeftSidebar;
