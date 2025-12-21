"use client";

import {
  Bell,
  ChevronsUpDown,
  Clock,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface UserNavProps {
  isAdmin?: boolean;
  className?: string;
}

export function UserNav({ isAdmin = false, className }: UserNavProps) {
  const { data } = authClient.useSession();
  const user = data?.user;
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "hover:bg-light800_dark300 transition-all duration-150",
          className
        )}
        aria-label="User navigation"
        asChild
      >
        <div
          className="flex-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full gap-2 rounded-lg p-0 focus:border-none! focus:ring-0! max-sm:p-2 lg:p-2"
          aria-label="User navigation"
        >
          <div className="flex-start grow gap-2">
            <UserAvatar
              id={user?.id}
              name={user?.name}
              image={user?.image ?? null}
              className="size-12 rounded-lg max-sm:size-8 lg:size-8"
              fallbackClassName="rounded-lg max-sm:text-sm text-xl lg:text-sm"
            />
            <div className="hidden flex-1 text-left text-sm leading-tight max-sm:grid lg:grid">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto hidden size-4 max-sm:block lg:block" />
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
              id={user?.id}
              name={user?.name}
              image={user?.image ?? ""}
              className="size-8 rounded-lg"
              fallbackClassName="rounded-lg"
              aria-label="User avatar"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin && <AdminItem />}
          <PendingQuestionsItem />
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
      <Link href="/dashboard">
        <LayoutDashboard className="size-4" /> <span>Dashboard</span>
      </Link>
    </DropdownMenuItem>
  );
}

function PendingQuestionsItem() {
  return (
    <DropdownMenuItem className="hover:bg-light800_dark300" asChild>
      <Link href="/pending-questions">
        <Clock className="size-4" /> <span>My Pending Questions</span>
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
      router.push("/");
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
