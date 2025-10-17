"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarTabs } from "@/common/constants";
import routes from "@/common/constants/routes";

interface NavTabsProps {
  userId?: string;
  isMobile?: boolean;
}

const NavTabs = ({ userId, isMobile = false }: NavTabsProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 flex-1">
      {sidebarTabs.map((item) => {
        // Don't show profile tab if user is not logged in
        if (item.route === "/profile" && !userId) {
          return null;
        }

        const appRoute =
          item.route === routes.profiles && userId
            ? routes.profile(userId)
            : item.route;

        const isActive =
          (pathname.includes(appRoute) && appRoute.length > 1) ||
          pathname === appRoute;

        const LinkComponent = (
          <Link
            href={appRoute}
            key={item.label}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900 rounded-lg hover:bg-light800_dark300!",
              "flex-start gap-4 bg-transparent p-4",
            )}
          >
            <Image
              src={item.imgUrl}
              alt={item.label}
              width={20}
              height={20}
              className={cn(
                { "invert-colors": !isActive },
                "transition-all duration-200",
              )}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobile && "max-lg:hidden",
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
