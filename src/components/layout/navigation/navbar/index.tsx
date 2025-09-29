import React from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getServerSession } from "@/lib/session";
import UserAvatar from "../../profile/UserAvatar";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <nav className="flex-between bg-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 transition-all duration-200">
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

      <p>Global search</p>

      <div className="flex-between gap-5">
        <ThemeToggle />

        {user?.id && (
          <UserAvatar
            id={user.id}
            name={user.name!}
            image={user.image}
            className="w-9 h-9 rounded-full"
          />
        )}

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
