"use client";

import { Route } from "next";
import { useRouter } from "next/navigation";
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
} from "@/components/ui";
import { Edit, Trash } from "lucide-react";

interface EditDeleteProps {
  type: "question" | "answer";
  itemId: string;
}

const EditDelete = ({ type, itemId }: EditDeleteProps) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/questions/${itemId}/edit` as Route);
  };

  const handleDelete = async () => {
    if (type === "question") {
      // Call API to delete question
    } else if (type === "answer") {
      // Call API to delete answer
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-2 max-sm:w-full ${type === "answer" && "gap-0 justify-center"}`}
    >
      {type === "question" && (
        <Button
          variant="ghost"
          className="hover:bg-primary-500/20! size-7.5 cursor-pointer"
          onClick={handleEdit}
        >
          <Edit className="text-primary-500 size-4.5" />
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <div className="bg-transparent flex-center size-7.5 hover:bg-red-500/20! rounded-md transition-all duration-100 cursor-pointer">
            <Trash className="text-red-500 size-4.5" />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-light900_dark200 border-light700_dark400">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "question" ? "question" : "answer"} and remove it from
              our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-light-800 dark:bg-dark-300 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="border-primary-100 bg-destructive text-light-800 cursor-pointer"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDelete;
