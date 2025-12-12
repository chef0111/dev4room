"use client";

import { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
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
import { useDeleteQuestion } from "@/queries/question.queries";
import { useDeleteAnswer } from "@/queries/answer.queries";

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
  const pathname = usePathname();

  const deleteQuestion = useDeleteQuestion({
    redirectTo: pathname.includes("questions") ? "/" : undefined,
  });

  const deleteAnswer = useDeleteAnswer();

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
          className="hover:bg-primary-500/20! size-8 active:scale-90"
          onClick={handleEdit}
        >
          <Edit className="text-primary-500 size-5" />
        </Button>
      )}

      {showDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-red-500/20! size-8 active:scale-90"
              disabled={isDeleting}
            >
              <Trash className="text-red-500 size-5" />
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
