"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  IconBan,
  IconCheck,
  IconDotsVertical,
  IconEye,
} from "@tabler/icons-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PendingQuestionData {
  id: string;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  rejectReason: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  tags: { id: string; name: string }[];
}

interface GetPendingQuestionColumnsProps {
  onApprove: (question: PendingQuestionData) => void;
  onReject: (question: PendingQuestionData) => void;
  onPreview: (question: PendingQuestionData) => void;
}

export function getPendingQuestionColumns({
  onApprove,
  onReject,
  onPreview,
}: GetPendingQuestionColumnsProps): ColumnDef<PendingQuestionData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 30,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Question" />
      ),
      meta: {
        label: "Title",
        variant: "text" as const,
        placeholder: "Search by title...",
      },
      enableColumnFilter: true,
      enableSorting: true,
      size: 400,
      cell: ({ row }) => {
        const question = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="line-clamp-2 font-medium">{question.title}</span>
            <div className="flex flex-wrap gap-1">
              {question.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {question.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{question.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "author",
      accessorKey: "author",
      header: "Author",
      size: 200,
      cell: ({ row }) => {
        const author = row.original.author;
        const initials = author.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {author.image && <AvatarImage src={author.image} />}
              <AvatarFallback className="size-7! text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{author.name}</span>
              <span className="text-muted-foreground text-xs">
                @{author.username}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      meta: {
        label: "Status",
        variant: "select" as const,
        options: [
          { label: "Pending", value: "pending" },
          { label: "Rejected", value: "rejected" },
        ],
      },
      enableColumnFilter: true,
      size: 120,
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "rejected") {
          return (
            <Badge variant="destructive" className="min-h-6">
              <IconBan className="mr-1 size-3" />
              Rejected
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="min-h-6 border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          >
            Pending
          </Badge>
        );
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Submitted" />
      ),
      meta: {
        label: "Submitted",
        variant: "date" as const,
      },
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
      size: 20,
      cell: ({ row }) => {
        const question = row.original;
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onPreview(question)}>
                <IconEye className="mr-2 size-4" />
                Preview
              </DropdownMenuItem>
              {question.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onApprove(question)}>
                    <IconCheck className="mr-2 size-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onReject(question)}
                  >
                    <IconBan className="mr-2 size-4" />
                    Reject
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
