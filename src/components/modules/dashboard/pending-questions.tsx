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
} from "@/queries/admin.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuestionCard from "@/components/modules/questions/question-card";
import { RejectQuestionDialog } from "./reject-question-dialog";
import WaitlistFallback from "./waitlist-fallback";
import WaitlistEmpty from "./waitlist-empty";

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

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "rejected">(
    "all"
  );
  const [previewQuestion, setPreviewQuestion] =
    useState<PendingQuestion | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [questionToReject, setQuestionToReject] =
    useState<PendingQuestion | null>(null);

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

  const openRejectDialog = (question: PendingQuestion) => {
    setQuestionToReject(question);
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setQuestionToReject(null);
  };

  if (isLoading) return <WaitlistFallback />;

  if (!questions || questions.length === 0) return <WaitlistEmpty />;

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

      <RejectQuestionDialog
        open={rejectDialogOpen}
        onOpenChange={closeRejectDialog}
        question={questionToReject}
      />
    </>
  );
}
