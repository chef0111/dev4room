"use client";

import { useState } from "react";
import {
  IconCheck,
  IconX,
  IconEye,
  IconClock,
  IconUser,
  IconTags,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  useAdminPendingQuestions,
  useApproveQuestion,
  useRejectQuestion,
} from "@/queries/admin.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface PendingQuestion {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  tags: { id: string; name: string }[];
}

export function PendingQuestions() {
  const { data: questions, isLoading } = useAdminPendingQuestions();
  const approveMutation = useApproveQuestion();
  const rejectMutation = useRejectQuestion();

  const [previewQuestion, setPreviewQuestion] =
    useState<PendingQuestion | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [questionToReject, setQuestionToReject] =
    useState<PendingQuestion | null>(null);

  const handleApprove = async (question: PendingQuestion) => {
    try {
      await approveMutation.mutateAsync(question.id);
      toast.success(`Question "${question.title}" approved`);
    } catch {
      toast.error("Failed to approve question");
    }
  };

  const handleReject = async () => {
    if (!questionToReject) return;
    try {
      await rejectMutation.mutateAsync(questionToReject.id);
      toast.success(`Question "${questionToReject.title}" rejected`);
      setRejectDialogOpen(false);
      setQuestionToReject(null);
    } catch {
      toast.error("Failed to reject question");
    }
  };

  const openRejectDialog = (question: PendingQuestion) => {
    setQuestionToReject(question);
    setRejectDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconClock className="size-5" />
            Pending Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconClock className="size-5" />
            Pending Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
            <IconCheck className="mb-2 size-12 text-green-500" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm">No pending questions to review.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconClock className="size-5" />
            Pending Questions
            <Badge variant="secondary" className="ml-2">
              {questions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {questions.map((question) => (
              <div
                key={question.id}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage src={question.author.image ?? undefined} />
                      <AvatarFallback>
                        <IconUser className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {question.author.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        @{question.author.username}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      •{" "}
                      {formatDistanceToNow(new Date(question.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <h4 className="line-clamp-2 font-medium">{question.title}</h4>

                  {question.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <IconTags className="text-muted-foreground size-3" />
                      {question.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {question.tags.length > 3 && (
                        <span className="text-muted-foreground text-xs">
                          +{question.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewQuestion(question)}
                  >
                    <IconEye className="size-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(question)}
                    disabled={approveMutation.isPending}
                  >
                    <IconCheck className="size-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">
                      Approve
                    </span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openRejectDialog(question)}
                    disabled={rejectMutation.isPending}
                  >
                    <IconX className="size-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">
                      Reject
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewQuestion}
        onOpenChange={() => setPreviewQuestion(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewQuestion?.title}</DialogTitle>
            <DialogDescription>
              By {previewQuestion?.author.name} (@
              {previewQuestion?.author.username})
            </DialogDescription>
          </DialogHeader>
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
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="default"
              onClick={() => {
                handleApprove(previewQuestion!);
                setPreviewQuestion(null);
              }}
              disabled={approveMutation.isPending}
            >
              <IconCheck className="mr-1 size-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                openRejectDialog(previewQuestion!);
                setPreviewQuestion(null);
              }}
            >
              <IconX className="mr-1 size-4" />
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Question?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the question &quot;
              {questionToReject?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
