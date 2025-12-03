import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

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
    <div className="flex flex-col gap-2 flex-1">
      {sidebarTabs.map((item) => {
        const LinkComponent = (
          <div className="flex-start max-lg:justify-center gap-4 text-dark300_light900 rounded-lg hover:bg-light800_dark300! bg-transparent p-3.5">
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
