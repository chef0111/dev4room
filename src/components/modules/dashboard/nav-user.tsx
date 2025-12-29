"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

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
import UserAvatar from "../profile/user-avatar";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavUser() {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useSidebar();
  const user = data?.user;

  if (!user || isPending)
    return <Skeleton className="h-10 w-full rounded-lg" />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                username={user?.username ?? undefined}
                name={user.name}
                image={user.image}
                className="size-12 rounded-lg max-sm:size-8 lg:size-8"
                fallbackClassName="rounded-lg max-sm:text-sm text-xl lg:text-sm"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  username={user.username ?? undefined}
                  name={user.name}
                  image={user.image}
                  className="size-12 rounded-lg max-sm:size-8 lg:size-8"
                  fallbackClassName="rounded-lg max-sm:text-sm text-xl lg:text-sm"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
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
