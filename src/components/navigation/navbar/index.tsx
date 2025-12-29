"use client";

import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/ui/dev";
import ThemeToggle from "./theme-toggle";
import CommandMenu from "@/components/navigation/navbar/command-menu";
import CommandMenuFallback from "@/components/navigation/navbar/command-menu-fallback";
import UserAvatar from "@/components/modules/profile/user-avatar";
import MobileNav from "@/components/navigation/left-sidebar/mobile-nav";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const session = authClient.useSession();
  const user = session.data?.user;

  return (
    <nav
      className={cn(
        "flex-between bg-sidebar fixed w-full px-6 py-4 sm:px-12 dark:shadow-none",
        className
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

        {user?.id && (
          <UserAvatar
            id={user.id}
            name={user.name}
            image={user.image ?? null}
            className="h-9 w-9 rounded-full"
            aria-label="User avatar"
          />
        )}

        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </div>
    </nav>
  );
};

export default Navbar;
