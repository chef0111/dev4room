import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { Menu } from "lucide-react";
import NavTabs from "./NavTabs";
import NavTabsFallback from "./NavTabsFallback";
import SidebarUser from "./SidebarUser";

const MobileNav = () => {
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
                <NavTabs isMobile={true} />
              </Suspense>
            </section>
          </SheetClose>
          <SheetClose asChild>
            <SidebarUser />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
