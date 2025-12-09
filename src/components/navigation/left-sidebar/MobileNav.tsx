import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Skeleton,
} from "@/components/ui";
import { Menu } from "lucide-react";
import { getServerSession } from "@/lib/session";
import NavTabs from "./NavTabs";
import NavTabsFallback from "./NavTabsFallback";
import { UserNav } from "@/components/modules/profile/UserNav";

const MobileNav = async () => {
  const session = await getServerSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="w-9 h-9 text-dark100_light900 sm:hidden cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-light900_dark200 border-none p-6">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/brand.svg"
            width={23}
            height={23}
            alt="DevFlow logo"
          />
          <p className="h2-bold font-esbuild text-dark-100 dark:text-light-900">
            Dev<span className="text-primary-500">Overflow</span>
          </p>
        </Link>
        <div className="no-scrollbar flex flex-col justify-between h-[calc(100vh-90px)] overflow-y-auto">
          <SheetClose asChild>
            <section className="h-full pt-10">
              <Suspense fallback={<NavTabsFallback isMobile={true} />}>
                <NavTabs userId={user?.id} isMobile={true} />
              </Suspense>
            </section>
          </SheetClose>

          <div className="flex flex-col gap-3">
            {user ? (
              <SheetClose className="w-full">
                <Suspense
                  fallback={<Skeleton className="h-10 w-full rounded-lg" />}
                >
                  <UserNav user={user} isAdmin={isAdmin} />
                </Suspense>
              </SheetClose>
            ) : (
              <>
                <SheetClose asChild>
                  <Link href="/login">
                    <Button className="btn-secondary no-focus min-h-10 w-full rounded-lg px-4 py-3 hover:bg-light700_dark300! transition-all duration-200 cursor-pointer">
                      <span className="primary-text-gradient small-medium ">
                        Log in
                      </span>
                    </Button>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/register">
                    <Button className="btn-tertiary no-focus light-border-2 min-h-10 w-full rounded-lg border px-4 py-3 hover:bg-light600_dark400! transition-all duration-200 cursor-pointer shadow-none">
                      <span className="text-dark400_light900 small-medium">
                        Register
                      </span>
                    </Button>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
