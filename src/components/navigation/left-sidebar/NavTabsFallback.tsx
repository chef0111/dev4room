import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui";

interface NavTabsProps {
  userId?: string;
  isMobile?: boolean;
}

export const sidebarTabs = [
  {
    imgUrl: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgUrl: "/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgUrl: "/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgUrl: "/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgUrl: "/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

const NavTabsFallback = ({ isMobile = false }: NavTabsProps) => {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {sidebarTabs.map((item) => {
        const LinkComponent = (
          <div className="flex-start text-dark300_light900 hover:bg-light800_dark300! gap-4 rounded-lg bg-transparent p-3.5 max-lg:justify-center">
            <Image
              src={item.imgUrl}
              alt={item.label}
              width={20}
              height={20}
              className="invert-colors"
            />
            <p className={cn("base-medium", !isMobile && "max-lg:hidden")}>
              {item.label}
            </p>
          </div>
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

export default NavTabsFallback;
