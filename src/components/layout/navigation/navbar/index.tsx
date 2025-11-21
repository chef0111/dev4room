import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import GlobalSearch from "../../main/GlobalSearch";
import CachedUserSection, { UserSectionSkeleton } from "./CachedUserSection";

const Navbar = () => {
  return (
    <nav className="flex-between bg-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12">
      <Link href="/" className="flex-center gap-2">
        <Image
          src="/images/brand.svg"
          width={23}
          height={23}
          alt="DevFlow logo"
        />
        <p className="h2-bold font-esbuild text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">4Room</span>
        </p>
      </Link>

      <GlobalSearch
        route="/"
        placeholder="Search anything globally..."
        className="flex-1 mx-4"
      />

      <div className="flex-between gap-5">
        <ThemeToggle />

        {/* Only this section uses cached session data */}
        <Suspense fallback={<UserSectionSkeleton />}>
          <CachedUserSection />
        </Suspense>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
