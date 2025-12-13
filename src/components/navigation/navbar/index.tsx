import { Suspense } from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "../left-sidebar/MobileNav";
import UserSection from "./UserSection";
import { Brand } from "@/components/ui";
import CommandMenu from "@/components/modules/main/CommandMenu";
import CommandMenuFallback from "@/components/modules/main/CommandMenuFallback";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  return (
    <nav
      className={cn(
        "flex-between bg-light900_dark200 fixed w-full p-6 sm:px-12 dark:shadow-none",
        className,
      )}
    >
      <Brand />

      <div className="mx-4 flex flex-1 justify-center">
        <Suspense fallback={<CommandMenuFallback />}>
          <CommandMenu />
        </Suspense>
      </div>

      <div className="flex-between gap-5">
        <ThemeToggle />

        <Suspense fallback={null}>
          <UserSection />
        </Suspense>

        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </div>
    </nav>
  );
};

export default Navbar;
