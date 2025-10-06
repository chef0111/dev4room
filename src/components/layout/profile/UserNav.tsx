"use client";

import { Bell, ChevronsUpDown, LayoutDashboard, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import routes from "@/common/constants/routes";
import { User } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserNavProps {
  user: User;
  isAdmin?: boolean;
}

export function UserNav({ user, isAdmin = false }: UserNavProps) {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-light800_dark300 transition-all duration-150"
        asChild
      >
        <div className="w-full flex-between gap-2 rounded-lg data-[state=open]:bg-accent data-[state=open]:text-sidebar-accent-foreground focus:ring-0! focus:border-none! max-sm:p-2 p-0 lg:p-2">
          <div className="flex-start flex-grow gap-2">
            <UserAvatar
              id={user.id}
              name={user.name}
              image={user.image ?? ""}
              className="max-sm:size-8 size-12 lg:size-8 rounded-lg"
              fallbackClassName="rounded-lg max-sm:text-sm text-xl lg:text-sm"
            />
            <div className="max-sm:grid hidden lg:grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto size-4 max-sm:block hidden lg:block" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-light900_dark200 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar
              id={user.id}
              name={user.name}
              image={user.image ?? ""}
              className="size-8 rounded-lg"
              fallbackClassName="rounded-lg"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin && <AdminItem />}
          <DropdownMenuItem className="hover:bg-light800_dark300">
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminItem() {
  return (
    <DropdownMenuItem className="hover:bg-light800_dark300" asChild>
      <Link href="/admin">
        <LayoutDashboard className="size-4" /> <span>Dashboard</span>
      </Link>
    </DropdownMenuItem>
  );
}

function LogoutItem() {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Logged out successfully");
      router.push(routes.home);
      router.refresh();
    }
  }

  return (
    <DropdownMenuItem
      className="hover:bg-light800_dark300"
      onClick={handleLogout}
    >
      <LogOut className="size-4" /> <span>Log out</span>
    </DropdownMenuItem>
  );
}
