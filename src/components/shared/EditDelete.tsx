"use client";

import { Route } from "next";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spinner,
} from "@/components/ui";
import { Edit, Trash } from "lucide-react";

interface EditDeleteProps {
  type: "question" | "answer";
  itemId: string;
  onEdit?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

const EditDelete = ({
  type,
  itemId,
  onEdit,
  showEdit = true,
  showDelete = true,
}: EditDeleteProps) => {
  const router = useRouter();

  const deleteQuestion = useMutation(
    orpc.question.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Question deleted successfully");
        router.push("/");
        router.refresh();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete question");
      },
    }),
  );

  const deleteAnswer = useMutation(
    orpc.answer.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Answer deleted successfully");
        router.refresh();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete answer");
      },
    }),
  );

  const isDeleting = deleteQuestion.isPending || deleteAnswer.isPending;

  const handleEdit = () => {
    if (type === "question") {
      router.push(`/questions/${itemId}/edit` as Route);
    } else if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    if (type === "question") {
      deleteQuestion.mutate({ questionId: itemId });
    } else {
      deleteAnswer.mutate({ answerId: itemId });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 max-sm:w-full">
      {showEdit && (
        <Button
          variant="ghost"
          className="hover:bg-primary-500/20! size-7.5 cursor-pointer"
          onClick={handleEdit}
        >
          <Edit className="text-primary-500 size-4.5" />
        </Button>
      )}

      {showDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-red-500/20! size-7.5 cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Spinner className="size-4.5" />
              ) : (
                <Trash className="text-red-500 size-4.5" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-light900_dark200 border-light700_dark400">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your{" "}
                {type} and remove it from our database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-light-800 dark:bg-dark-300 cursor-pointer"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="border-primary-100 bg-destructive hover:bg-red-500 text-light-800 cursor-pointer"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Spinner />
                    Deleting...
                  </>
                ) : (
                  "Continue"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default EditDelete;
