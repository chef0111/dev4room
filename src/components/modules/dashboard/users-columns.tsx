"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  IconAddressBook,
  IconBan,
  IconDotsVertical,
  IconShield,
  IconShieldOff,
  IconTrash,
  IconUser,
  IconUserEdit,
} from "@tabler/icons-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  questionCount: number;
  answerCount: number;
  reputation: number;
  createdAt: Date;
}

interface GetUserColumnsProps {
  currentUserId?: string;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onSetRole: (userId: string, role: "admin" | "user" | null) => void;
  onDelete: (userId: string) => void;
}

export function getUserColumns({
  currentUserId,
  onBan,
  onUnban,
  onSetRole,
  onDelete,
}: GetUserColumnsProps): ColumnDef<UserData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="User" />
      ),
      meta: {
        label: "Name",
        variant: "text" as const,
        placeholder: "Search by name...",
      },
      enableColumnFilter: true,
      enableSorting: true,
      size: 300,
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground text-xs">
                @{user.username}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      meta: {
        label: "Email",
        variant: "text" as const,
        placeholder: "Search by email...",
      },
      enableColumnFilter: true,
      size: 250,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      meta: {
        label: "Role",
        variant: "select" as const,
        options: [
          { label: "Admin", value: "admin" },
          { label: "User", value: "user" },
        ],
      },
      enableColumnFilter: true,
      size: 100,
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === "admin") {
          return (
            <Badge
              variant="default"
              className="border-primary/30 min-h-7 border bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <IconShield className="mr-1 size-3" />
              Admin
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground border-border bg-muted min-h-7"
          >
            <IconUser className="size-3" />
            User
          </Badge>
        );
      },
    },
    {
      id: "status",
      accessorKey: "banned",
      header: "Status",
      meta: {
        label: "Status",
        variant: "select" as const,
        options: [
          { label: "Active", value: "active" },
          { label: "Banned", value: "banned" },
          { label: "Unverified", value: "unverified" },
        ],
      },
      enableColumnFilter: true,
      size: 120,
      cell: ({ row }) => {
        const user = row.original;
        if (user.banned) {
          return (
            <Badge variant="destructive" className="min-h-7">
              <IconBan className="size-3" />
              Banned
            </Badge>
          );
        }
        if (!user.emailVerified) {
          return (
            <Badge
              variant="outline"
              className="min-h-7 border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
            >
              Unverified
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="min-h-7 border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
          >
            Active
          </Badge>
        );
      },
    },
    {
      id: "questionCount",
      accessorKey: "questionCount",
      header: () => <div className="text-right">Questions</div>,
      meta: {
        label: "Questions",
        variant: "number" as const,
      },
      enableSorting: true,
      size: 100,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.original.questionCount)}
        </div>
      ),
    },
    {
      id: "answerCount",
      accessorKey: "answerCount",
      header: () => <div className="text-right">Answers</div>,
      meta: {
        label: "Answers",
        variant: "number" as const,
      },
      enableSorting: true,
      size: 100,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.original.answerCount)}
        </div>
      ),
    },
    {
      id: "reputation",
      accessorKey: "reputation",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label="Reputation"
          className="justify-end"
        />
      ),
      meta: {
        label: "Reputation",
        variant: "number" as const,
      },
      enableSorting: true,
      size: 100,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.original.reputation)}
        </div>
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Joined" />
      ),
      meta: {
        label: "Joined",
        variant: "date" as const,
      },
      enableColumnFilter: true,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      size: 40,
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = currentUserId === user.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem>
                <IconAddressBook className="mr-1 size-4" />
                <Link
                  href={`/profile/${user.id}`}
                  target="_blank"
                  className="w-full"
                >
                  View Profile
                </Link>
              </DropdownMenuItem>
              {!isSelf ? (
                <>
                  <DropdownMenuSeparator />
                  {user.role === "admin" ? (
                    <DropdownMenuItem
                      onClick={() => onSetRole(user.id, "user")}
                    >
                      <IconShieldOff className="mr-1 size-4" />
                      Remove Admin
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => onSetRole(user.id, "admin")}
                    >
                      <IconShield className="mr-1 size-4" />
                      Make Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {user.banned ? (
                    <DropdownMenuItem onClick={() => onUnban(user.id)}>
                      <IconShieldOff className="mr-1 size-4" />
                      Unban User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onBan(user.id)}
                    >
                      <IconBan className="mr-1 size-4" />
                      Ban User
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(user.id)}
                  >
                    <IconTrash className="mr-1 size-4" />
                    Delete User
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconUserEdit className="mr-1 size-4" />
                    <Link
                      href={`/profile/edit`}
                      target="_blank"
                      className="w-full"
                    >
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
