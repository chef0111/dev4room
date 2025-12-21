"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  IconSearch,
  IconBan,
  IconShield,
  IconShieldOff,
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconUser,
  IconTrash,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  useAdminUsers,
  useBanUser,
  useUnbanUser,
  useSetUserRole,
  useDeleteUser,
} from "@/queries/admin.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BanUserDialog } from "./ban-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { cn, formatNumber } from "@/lib/utils";
import TableContentSkeleton from "@/components/skeletons/TableContentSkeleton";

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  questionCount: number;
  answerCount: number;
  reputation: number;
  createdAt: Date;
}

function UserRowActions({
  user,
  onBan,
  onUnban,
  onSetRole,
  onDelete,
}: {
  user: UserData;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onSetRole: (userId: string, role: "admin" | "user" | null) => void;
  onDelete: (userId: string) => void;
}) {
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
      <DropdownMenuContent align="end" className="w-48">
        {user.role === "admin" ? (
          <DropdownMenuItem onClick={() => onSetRole(user.id, "user")}>
            <IconShieldOff className="mr-2 size-4" />
            Remove Admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onSetRole(user.id, "admin")}>
            <IconShield className="mr-2 size-4" />
            Make Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {user.banned ? (
          <DropdownMenuItem onClick={() => onUnban(user.id)}>
            <IconShieldOff className="mr-2 size-4" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onBan(user.id)}
          >
            <IconBan className="mr-2 size-4" />
            Ban User
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete(user.id)}
        >
          <IconTrash className="mr-2 size-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Ban dialog state
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, roleFilter, bannedFilter]);

  const { data, isLoading, error } = useAdminUsers({
    search: debouncedSearch || undefined,
    role: roleFilter,
    banned: bannedFilter,
    limit: pageSize,
    offset: page * pageSize,
  });

  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const setUserRoleMutation = useSetUserRole();
  const deleteUserMutation = useDeleteUser();

  const handleBan = (userId: string) => {
    setUserToBan(userId);
    setBanDialogOpen(true);
  };

  const handleConfirmBan = () => {
    if (!userToBan || banReason.length < 10) return;

    banUserMutation.mutate(
      { userId: userToBan, reason: banReason },
      {
        onSuccess: () => {
          toast.success("User banned successfully");
          setBanDialogOpen(false);
          setUserToBan(null);
          setBanReason("");
        },
        onError: () => {
          toast.error("Failed to ban user");
        },
      }
    );
  };

  const handleUnban = (userId: string) => {
    unbanUserMutation.mutate(userId, {
      onSuccess: () => toast.success("User unbanned successfully"),
      onError: () => toast.error("Failed to unban user"),
    });
  };

  const handleSetRole = (userId: string, role: "admin" | "user" | null) => {
    setUserRoleMutation.mutate(
      { userId, role },
      {
        onSuccess: () =>
          toast.success(`User role updated to ${role || "user"}`),
        onError: () => toast.error("Failed to update user role"),
      }
    );
  };

  const handleDelete = (userId: string) => {
    const user = data?.users.find((u) => u.id === userId);
    if (user) {
      setUserToDelete({ id: user.id, name: user.name });
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    });
  };

  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: "name",
      header: "User",
      id: "user",
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
      accessorKey: "email",
      header: "Email",
      size: 250,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "questionCount",
      header: () => <div className="text-right">Questions</div>,
      size: 100,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.original.questionCount)}
        </div>
      ),
    },
    {
      accessorKey: "answerCount",
      header: () => <div className="text-right">Answers</div>,
      size: 100,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.original.answerCount)}
        </div>
      ),
    },
    {
      accessorKey: "reputation",
      header: () => <div className="text-right">Reputation</div>,
      size: 100,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.original.reputation)}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Status",
      size: 100,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex-center gap-1.5">
            {user.role === "admin" && (
              <Badge
                variant="default"
                className="min-h-6 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              >
                <IconShield className="mr-1 size-3" />
                Admin
              </Badge>
            )}
            {user.banned && (
              <Badge variant="destructive" className="min-h-6">
                <IconBan className="mr-1 size-3" />
                Banned
              </Badge>
            )}
            {user.role !== "admin" && !user.banned && (
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted min-h-6"
              >
                <IconUser className="mr-1 size-3" />
                User
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      size: 100,
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
      size: 60,
      cell: ({ row }) => (
        <UserRowActions
          user={row.original}
          onBan={handleBan}
          onUnban={handleUnban}
          onSetRole={handleSetRole}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total ?? 0) / pageSize),
  });

  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

  if (error) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Failed to load users. Make sure you have admin access.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        {/* Header with filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">User Management</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <IconSearch className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
            <Select
              value={roleFilter ?? "all"}
              onValueChange={(v) => setRoleFilter(v === "all" ? undefined : v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                bannedFilter === undefined
                  ? "all"
                  : bannedFilter
                    ? "banned"
                    : "active"
              }
              onValueChange={(v) =>
                setBannedFilter(v === "all" ? undefined : v === "banned")
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <Table className="[&_td]:px-4 [&_th]:px-4">
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const userColumn = header.column.id === "User";

                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className={cn(userColumn && "mx-8")}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableContentSkeleton />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="smooth-hover">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-20">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setPage(0)}
                disabled={page === 0}
              >
                <IconChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
              >
                <IconChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setPage(totalPages - 1)}
                disabled={page >= totalPages - 1}
              >
                <IconChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ban Dialog */}
      <BanUserDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        banReason={banReason}
        onBanReasonChange={setBanReason}
        onConfirm={handleConfirmBan}
        isPending={banUserMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userName={userToDelete?.name ?? null}
        onConfirm={handleConfirmDelete}
        isPending={deleteUserMutation.isPending}
      />
    </>
  );
}
