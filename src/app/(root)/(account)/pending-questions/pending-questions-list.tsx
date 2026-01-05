"use client";

import { useState } from "react";
import { IconClock, IconTrash, IconEye, IconBan } from "@tabler/icons-react";
import { useCancelPendingQuestion } from "@/queries/question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QuestionCard from "@/components/modules/questions/question-card";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditDelete from "@/components/shared/edit-delete";
import { AlertCircleIcon } from "lucide-react";

interface PendingQuestion {
  id: string;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  rejectReason: string | null;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorImage: string | null;
  tags: { id: string; name: string }[];
}

interface PendingQuestionsListProps {
  questions: PendingQuestion[];
}

export default function PendingQuestionsList({
  questions,
}: PendingQuestionsListProps) {
  const cancelMutation = useCancelPendingQuestion();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [questionToCancel, setQuestionToCancel] =
    useState<PendingQuestion | null>(null);

  const pendingQuestions = questions.filter((q) => q.status === "pending");
  const rejectedQuestions = questions.filter((q) => q.status === "rejected");

  const handleCancel = async () => {
    if (!questionToCancel) return;
    try {
      await cancelMutation.mutateAsync({ questionId: questionToCancel.id });
      setCancelDialogOpen(false);
      setQuestionToCancel(null);
    } catch {
      // Error handled by mutation
    }
  };

  const openCancelDialog = (question: PendingQuestion) => {
    setQuestionToCancel(question);
    setCancelDialogOpen(true);
  };

  return (
    <>
      {/* Pending Questions Section */}
      {pendingQuestions.length > 0 && (
        <>
          <Alert className="bg-light800_dark300/50 border-light700_dark400 mt-10 border">
            <IconClock className="text-dark500_light700 size-4" />
            <AlertTitle className="text-dark100_light900 flex items-center gap-2">
              Awaiting Admin Review
              <Badge
                variant="secondary"
                className="bg-light700_dark400 text-light400_light500 ml-2"
              >
                {pendingQuestions.length}/3
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-dark500_light700">
              These questions are being reviewed by our admins. You can have up
              to 3 pending questions at a time. Once approved, they will appear
              in the public question list.
            </AlertDescription>
          </Alert>

          <div className="mt-10 flex w-full flex-col gap-6">
            {pendingQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={{
                  ...question,
                  downvotes: 0,
                  author: {
                    id: question.authorId,
                    name: question.authorName,
                    username: question.authorUsername,
                    image: question.authorImage,
                  },
                }}
                href={`/pending-questions/${question.id}`}
                customActions={
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openCancelDialog(question)}
                      disabled={cancelMutation.isPending}
                    >
                      <IconTrash className="size-4" />
                      <span className="hidden sm:inline">Cancel</span>
                    </Button>

                    <EditDelete
                      type="question"
                      itemId={question.id}
                      showDelete={false}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Rejected Questions Section */}
      {rejectedQuestions.length > 0 && (
        <>
          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/30 mt-10 border"
          >
            <IconBan className="text-destructive size-4" />
            <AlertTitle className="flex items-center gap-2">
              Rejected Questions
              <Badge variant="destructive" className="ml-2">
                {rejectedQuestions.length}
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-dark500_light700">
              These questions were rejected by our admins. Review the feedback
              and edit your question to resubmit for review.
            </AlertDescription>
          </Alert>

          <div className="mt-10 flex w-full flex-col gap-6">
            {rejectedQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={{
                  ...question,
                  downvotes: 0,
                  author: {
                    id: question.authorId,
                    name: question.authorName,
                    username: question.authorUsername,
                    image: question.authorImage,
                  },
                }}
                href={`/pending-questions/${question.id}`}
                customActions={
                  <div className="flex items-center gap-2">
                    {/* Rejected Badge with Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge
                          variant="destructive"
                          className="hover:bg-destructive/80 h-7 cursor-pointer"
                        >
                          <IconBan className="size-4" />
                          Rejected
                        </Badge>
                      </DialogTrigger>
                      <DialogContent className="background-light900_dark200 sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-dark100_light900">
                            Question Rejected
                          </DialogTitle>
                          <DialogDescription className="text-dark500_light700">
                            An admin has reviewed your question and provided
                            feedback.
                          </DialogDescription>
                        </DialogHeader>
                        <Alert
                          variant="destructive"
                          className="bg-destructive/10 mt-4 rounded-md p-4"
                        >
                          <AlertCircleIcon />
                          <AlertTitle>Rejection Reason:</AlertTitle>
                          <AlertDescription className="text-sm">
                            {question.rejectReason || "No reason provided."}
                          </AlertDescription>
                        </Alert>
                        <p className="text-dark500_light700 mt-4 text-sm">
                          Please edit your question to address the feedback and
                          resubmit for review.
                        </p>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-light800_dark300 text-dark400_light700 border-light700_dark400"
                      asChild
                    >
                      <Link href={`/pending-questions/${question.id}`}>
                        <IconEye className="size-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openCancelDialog(question)}
                      disabled={cancelMutation.isPending}
                    >
                      <IconTrash className="size-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>

                    <EditDelete
                      type="question"
                      itemId={question.id}
                      showDelete={false}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="background-light900_dark200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-dark100_light900">
              {questionToCancel?.status === "rejected"
                ? "Delete Question?"
                : "Cancel Question?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark500_light700">
              This will permanently delete your{" "}
              {questionToCancel?.status === "rejected" ? "rejected" : "pending"}{" "}
              question &quot;{questionToCancel?.title}&quot;. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-light800_dark300 text-dark400_light700">
              Keep Question
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {questionToCancel?.status === "rejected"
                ? "Delete Question"
                : "Cancel Question"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
