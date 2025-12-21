"use client";

import { useState, useMemo } from "react";
import {
  IconCheck,
  IconX,
  IconEye,
  IconClock,
  IconBan,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import QuestionCard from "@/components/modules/questions/QuestionCard";

interface PendingQuestion {
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

export function PendingQuestions() {
  const { data: questions, isLoading } = useAdminPendingQuestions();
  const approveMutation = useApproveQuestion();
  const rejectMutation = useRejectQuestion();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "rejected">(
    "all"
  );
  const [previewQuestion, setPreviewQuestion] =
    useState<PendingQuestion | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [questionToReject, setQuestionToReject] =
    useState<PendingQuestion | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    if (activeTab === "all") return questions;
    return questions.filter((q) => q.status === activeTab);
  }, [questions, activeTab]);

  const pendingCount =
    questions?.filter((q) => q.status === "pending").length ?? 0;
  const rejectedCount =
    questions?.filter((q) => q.status === "rejected").length ?? 0;

  const handleApprove = async (question: PendingQuestion) => {
    try {
      await approveMutation.mutateAsync(question.id);
      toast.success(`Question "${question.title}" approved`);
    } catch {
      toast.error("Failed to approve question");
    }
  };

  const handleReject = async () => {
    if (!questionToReject || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({
        questionId: questionToReject.id,
        reason: rejectReason,
      });
      toast.success(`Question "${questionToReject.title}" rejected`);
      setRejectDialogOpen(false);
      setQuestionToReject(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject question");
    }
  };

  const openRejectDialog = (question: PendingQuestion) => {
    setQuestionToReject(question);
    setRejectReason("");
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
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "all" | "pending" | "rejected")
            }
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({questions.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="flex flex-col gap-4">
                {filteredQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={{
                      id: question.id,
                      title: question.title,
                      content: question.content,
                      tags: question.tags,
                      author: {
                        id: question.author.id,
                        name: question.author.name,
                        image: question.author.image,
                      },
                      createdAt: question.createdAt,
                      upvotes: 0,
                      downvotes: 0,
                      answers: 0,
                      views: 0,
                    }}
                    href={"#"}
                    customActions={
                      <div className="flex items-center gap-2">
                        {question.status === "rejected" && (
                          <Badge variant="destructive">
                            <IconBan className="size-4" />
                            Rejected
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewQuestion(question)}
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {question.status === "pending" && (
                          <>
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
                              <IconBan className="size-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">
                                Reject
                              </span>
                            </Button>
                          </>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
                <IconX className="size-4" />
                Reject
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog with Reason Input */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Question</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason for rejecting &quot;{questionToReject?.title}
              &quot;. The author will see this reason and can edit their
              question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">Rejection Reason</Label>
            <Textarea
              id="reject-reason"
              placeholder="Explain why this question is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
