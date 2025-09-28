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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import routes from "@/common/constants/routes";
import { User } from "@/lib/auth";

interface UserNavProps {
  user: User;
  isAdmin?: boolean;
}

export function UserNav({ user, isAdmin = false }: UserNavProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-light800_dark300" asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                id={user.id}
                name={user.name}
                image={user.image}
                className="size-8 rounded-lg"
                fallbackClassName="rounded-lg"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
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
                  image={user.image}
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
      </SidebarMenuItem>
    </SidebarMenu>
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
