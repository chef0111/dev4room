"use client";

import { useState, useMemo } from "react";
import { IconCheck, IconClock, IconBan } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  useQueryStates,
} from "nuqs";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminPendingQuestions,
  useApproveQuestion,
} from "@/queries/admin.queries";
import { useDataTable } from "@/hooks/use-data-table";
import {
  getPendingQuestionColumns,
  type PendingQuestionData,
} from "./pending-questions-columns";
import { RejectQuestionDialog } from "./reject-question-dialog";
import WaitlistEmpty from "./waitlist-empty";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export function PendingQuestions() {
  // URL state for pagination and filtering
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));

  // Read filter values from URL
  const [filterValues] = useQueryStates({
    title: parseAsString.withDefault(""),
    status: parseAsArrayOf(parseAsString, ",").withDefault([]),
  });

  // Convert filter values to API params
  const apiParams = useMemo(() => {
    return {
      search: filterValues.title || undefined,
      status:
        filterValues.status.length === 1
          ? (filterValues.status[0] as "pending" | "rejected")
          : undefined,
      limit: perPage,
      offset: (page - 1) * perPage,
    };
  }, [filterValues, page, perPage]);

  const { data, isLoading, error } = useAdminPendingQuestions(apiParams);
  const approveMutation = useApproveQuestion();

  // Dialog state
  const [previewQuestion, setPreviewQuestion] =
    useState<PendingQuestionData | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [questionToReject, setQuestionToReject] =
    useState<PendingQuestionData | null>(null);

  const handleApprove = async (question: PendingQuestionData) => {
    try {
      await approveMutation.mutateAsync(question.id);
      toast.success(`Question "${question.title}" approved`);
    } catch {
      toast.error("Failed to approve question");
    }
  };

  const openRejectDialog = (question: PendingQuestionData) => {
    setQuestionToReject(question);
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setQuestionToReject(null);
  };

  const columns = useMemo(
    () =>
      getPendingQuestionColumns({
        onApprove: handleApprove,
        onReject: openRejectDialog,
        onPreview: setPreviewQuestion,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { table } = useDataTable({
    data: data?.questions ?? [],
    columns,
    pageCount: Math.ceil((data?.total ?? 0) / perPage),
    initialState: {
      pagination: { pageSize: perPage, pageIndex: page - 1 },
      sorting: [{ id: "createdAt", desc: true }],
    },
  });

  if (error) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Failed to load pending questions. Make sure you have admin access.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !data) {
    return (
      <DataTableSkeleton
        columnCount={5}
        rowCount={5}
        filterCount={2}
        withPagination
        withViewOptions
      />
    );
  }

  if (!data || data.total === 0) {
    return <WaitlistEmpty />;
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedPendingQuestions = selectedRows.filter(
    (row) => row.original.status === "pending"
  );

  const handleBulkApprove = async () => {
    const pendingIds = selectedPendingQuestions.map((row) => row.original.id);
    if (pendingIds.length === 0) {
      toast.error("No pending questions selected");
      return;
    }

    let successCount = 0;
    for (const id of pendingIds) {
      try {
        await approveMutation.mutateAsync(id);
        successCount++;
      } catch {
        // Continue with next
      }
    }

    if (successCount > 0) {
      toast.success(`Approved ${successCount} question(s)`);
      table.resetRowSelection();
    }
  };

  return (
    <>
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconClock className="size-5" />
            Pending Questions
            <Badge variant="secondary" className="ml-2">
              {data.total}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            table={table}
            actionBar={
              selectedPendingQuestions.length > 0 && (
                <Item
                  variant="outline"
                  size="sm"
                  className="bg-background fixed inset-x-0 bottom-6 z-50 mx-auto w-fit gap-6 shadow-lg"
                >
                  <ItemContent className="text-muted-foreground gap-2 text-sm">
                    {selectedPendingQuestions.length} pending question(s)
                    selected
                  </ItemContent>
                  <ItemActions>
                    <Button
                      size="sm"
                      onClick={handleBulkApprove}
                      disabled={approveMutation.isPending}
                    >
                      <IconCheck className="size-4" />
                      Approve All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => table.resetRowSelection()}
                    >
                      Clear
                    </Button>
                  </ItemActions>
                </Item>
              )
            }
          >
            <DataTableToolbar table={table} />
          </DataTable>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewQuestion}
        onOpenChange={() => setPreviewQuestion(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewQuestion?.title}
              {previewQuestion?.status === "rejected" && (
                <Badge variant="destructive">Rejected</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              By {previewQuestion?.author.name} (@
              {previewQuestion?.author.username})
            </DialogDescription>
          </DialogHeader>
          {previewQuestion?.status === "rejected" &&
            previewQuestion.rejectReason && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                <strong>Rejection Reason:</strong>{" "}
                {previewQuestion.rejectReason}
              </div>
            )}
          <div className="prose dark:prose-invert mt-4 max-w-none">
            <div className="whitespace-pre-wrap">
              {previewQuestion?.content}
            </div>
          </div>
          {previewQuestion?.tags && previewQuestion.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {previewQuestion.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          {previewQuestion?.status === "pending" && (
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="default"
                onClick={() => {
                  handleApprove(previewQuestion!);
                  setPreviewQuestion(null);
                }}
                disabled={approveMutation.isPending}
              >
                <IconCheck className="size-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  openRejectDialog(previewQuestion!);
                  setPreviewQuestion(null);
                }}
              >
                <IconBan className="size-4" />
                Reject
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RejectQuestionDialog
        open={rejectDialogOpen}
        onOpenChange={closeRejectDialog}
        question={questionToReject}
      />
    </>
  );
}
