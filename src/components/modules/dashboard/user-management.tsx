"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useQueryState,
  parseAsInteger,
  parseAsBoolean,
  parseAsString,
  parseAsArrayOf,
  useQueryStates,
} from "nuqs";
import { FileSpreadsheet, Table2 } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  parseAdvancedFilters,
  parseBasicFilters,
} from "@/lib/table/user-filters";
import { BanUserDialog } from "./ban-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { getUserColumns } from "./users-columns";
import { useDataTable } from "@/hooks/use-data-table";
import {
  useAdminUsers,
  useBanUser,
  useUnbanUser,
  useSetUserRole,
  useDeleteUser,
} from "@/queries/admin.queries";
import { getFiltersStateParser } from "@/lib/table/parsers";
import Loading from "@/app/(admin)/dashboard/users/loading";
import { authClient } from "@/lib/auth-client";

// Column IDs that can be filtered
const FILTERABLE_COLUMNS = [
  "name",
  "email",
  "role",
  "status",
  "createdAt",
] as const;

interface UserData {
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

export function UserManagement() {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  // Toggle between basic and advanced filter mode
  const [advancedMode, setAdvancedMode] = useQueryState(
    "advanced",
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
      shallow: true,
    })
  );

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

  // URL state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));

  // Read basic filter values from URL
  const [basicFilterValues] = useQueryStates({
    name: parseAsString.withDefault(""),
    email: parseAsString.withDefault(""),
    role: parseAsArrayOf(parseAsString, ",").withDefault([]),
    status: parseAsArrayOf(parseAsString, ",").withDefault([]),
    createdAt: parseAsString.withDefault(""),
  });

  // Advanced mode filters
  const [advancedFilters] = useQueryState(
    "filters",
    getFiltersStateParser<UserData>(
      FILTERABLE_COLUMNS as unknown as string[]
    ).withDefault([])
  );

  // Convert filters to API parameters
  const apiParams = useMemo(() => {
    const baseParams = advancedMode
      ? parseAdvancedFilters(advancedFilters)
      : parseBasicFilters(basicFilterValues);

    return {
      ...baseParams,
      limit: perPage,
      offset: (page - 1) * perPage,
    };
  }, [advancedMode, advancedFilters, basicFilterValues, page, perPage]);

  const { data, isLoading, error } = useAdminUsers(apiParams);

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
    const user = data?.users.find((u) => u.id === userId);

    if (role === "admin" && user) {
      if (user.banned) {
        toast.error("Cannot promote a banned user to admin");
        return;
      }
      if (!user.emailVerified) {
        toast.error("Cannot promote an unverified user to admin");
        return;
      }
    }

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

  const columns = useMemo(
    () =>
      getUserColumns({
        currentUserId,
        onBan: handleBan,
        onUnban: handleUnban,
        onSetRole: handleSetRole,
        onDelete: handleDelete,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.users, currentUserId]
  );

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: data?.users ?? [],
    columns,
    pageCount: Math.ceil((data?.total ?? 0) / perPage),
    enableAdvancedFilter: advancedMode,
    initialState: {
      pagination: { pageSize: perPage, pageIndex: page - 1 },
      sorting: [{ id: "createdAt", desc: true }],
    },
  });

  if (error) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Failed to load users. Make sure you have admin access.
        </p>
      </div>
    );
  }

  if (isLoading && !data) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Management</h2>

          {/* Toggle between basic and advanced filter modes */}
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={advancedMode ? "advanced" : "basic"}
            onValueChange={(value) => {
              if (value) {
                setAdvancedMode(value === "advanced");
              }
            }}
            className="gap-0"
          >
            <Tooltip delayDuration={300}>
              <ToggleGroupItem
                value="basic"
                className="data-[state=on]:bg-accent/70 px-3 text-xs whitespace-nowrap"
                asChild
              >
                <TooltipTrigger>
                  <Table2 className="mr-1 size-3.5" />
                  Basic
                </TooltipTrigger>
              </ToggleGroupItem>
              <TooltipContent side="bottom" sideOffset={6}>
                <p>Quick filters in toolbar</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={300}>
              <ToggleGroupItem
                value="advanced"
                className="data-[state=on]:bg-accent/70 px-3 text-xs whitespace-nowrap"
                asChild
              >
                <TooltipTrigger>
                  <FileSpreadsheet className="mr-1 size-3.5" />
                  Advanced
                </TooltipTrigger>
              </ToggleGroupItem>
              <TooltipContent side="bottom" sideOffset={6}>
                <p>Advance filter builder</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>

        <DataTable table={table}>
          {advancedMode ? (
            <DataTableAdvancedToolbar table={table}>
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
                align="start"
              />
            </DataTableAdvancedToolbar>
          ) : (
            <DataTableToolbar table={table} />
          )}
        </DataTable>
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
