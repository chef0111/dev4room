"use client";

import { useState } from "react";
import { IconClock, IconX, IconEye } from "@tabler/icons-react";
import { useCancelPendingQuestion } from "@/queries/question.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QuestionCard from "@/components/modules/questions/QuestionCard";
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

interface PendingQuestion {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
  authorId: string;
  authorName: string;
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
      <Alert className="bg-light800_dark300 border-light700_dark400 mt-10 border">
        <IconClock className="text-dark500_light700 size-4" />
        <AlertTitle className="text-dark100_light900 flex items-center gap-2">
          Awaiting Admin Review
          <Badge
            variant="secondary"
            className="bg-light700_dark400 text-light400_light500 ml-2"
          >
            {questions.length}/3
          </Badge>
        </AlertTitle>
        <AlertDescription className="text-dark500_light700">
          These questions are being reviewed by our admins. You can have up to 3
          pending questions at a time. Once approved, they will appear in the
          public question list.
        </AlertDescription>
      </Alert>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={{
              ...question,
              downvotes: 0,
              author: {
                id: question.authorId,
                name: question.authorName,
                image: question.authorImage,
              },
            }}
            customActions={
              <div className="flex items-center gap-2">
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
                  <IconX className="size-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="background-light900_dark200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-dark100_light900">
              Cancel Question?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark500_light700">
              This will permanently delete your pending question &quot;
              {questionToCancel?.title}&quot;. This action cannot be undone.
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
              Cancel Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
