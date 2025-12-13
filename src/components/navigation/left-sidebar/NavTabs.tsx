"use client";

import React from "react";
import { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { SheetClose } from "@/components/ui";
import { sidebarTabs } from "@/common/constants";

interface NavTabsProps {
  isMobile?: boolean;
}

const NavTabs = ({ isMobile = false }: NavTabsProps) => {
  const { data } = authClient.useSession();
  const user = data?.user;
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col gap-3 sm:gap-2">
      {sidebarTabs.map((item) => {
        // Don't show profile tab if user is not logged in
        if (item.route === "/profile" && !user?.id) {
          return null;
        }

        const appRoute =
          item.route === "/profile" && user?.id
            ? `/profile/${user.id}`
            : item.route;

        const isActive =
          (pathname.includes(appRoute) && appRoute.length > 1) ||
          pathname === appRoute;

        const LinkComponent = (
          <Link
            href={appRoute as Route}
            key={item.label}
            className={cn(
              isActive
                ? "primary-gradient text-light-900 rounded-lg"
                : "text-dark300_light900 hover:bg-light800_dark300! smooth-hover rounded-lg [&:not(:hover)]:duration-200!",
              "flex-start gap-4 bg-transparent p-3.5 max-lg:justify-center max-sm:justify-start max-sm:p-5",
            )}
          >
            <Image
              src={item.imgUrl}
              alt={`${item.label} icon`}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobile && "max-lg:hidden",
                "max-sm:text-xl",
              )}
            >
              {item.label}
            </p>
          </Link>
        );

        return isMobile ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </div>
  );
};

export default NavTabs;
