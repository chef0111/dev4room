"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconBan } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/form";
import { Spinner } from "@/components/ui/spinner";
import { useRejectQuestion } from "@/queries/admin";

const RejectReasonSchema = z.object({
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must be at most 500 characters"),
});

type RejectReasonValues = z.infer<typeof RejectReasonSchema>;

interface RejectQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: {
    id: string;
    title: string;
  } | null;
}

export function RejectQuestionDialog({
  open,
  onOpenChange,
  question,
}: RejectQuestionDialogProps) {
  const rejectMutation = useRejectQuestion();

  const form = useForm<RejectReasonValues>({
    resolver: zodResolver(RejectReasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleReject = async (values: RejectReasonValues) => {
    if (!question) return;

    try {
      await rejectMutation.mutateAsync({
        questionId: question.id,
        reason: values.reason,
      });
      toast.success(`Question "${question.title}" rejected`);
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to reject question");
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <IconBan className="text-destructive size-5" />
            Reject Question
          </AlertDialogTitle>
          <AlertDialogDescription>
            Provide a reason for rejecting &quot;{question?.title}&quot;. The
            author will see this reason and can edit their question.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleReject)}>
          <div className="py-4">
            <FormTextarea
              name="reason"
              control={form.control}
              label="Rejection Reason"
              description="Explain why this question is being rejected"
              placeholder="E.g., The question lacks clarity, please provide more details about..."
              rows={4}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={rejectMutation.isPending || !form.formState.isValid}
            >
              {rejectMutation.isPending ? (
                <>
                  <Spinner className="border-destructive-foreground/30 border-t-destructive-foreground!" />
                  Rejecting...
                </>
              ) : (
                "Reject Question"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
