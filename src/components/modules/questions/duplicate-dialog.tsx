"use client";

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
import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";

interface DuplicateQuestion {
  id: string;
  title: string;
  titleSimilarity?: number;
  contentSimilarity?: number;
}

interface DuplicateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicates: DuplicateQuestion[];
  onSubmitAnyway: () => void;
  isSubmitting?: boolean;
}

const DuplicateDialog = ({
  open,
  onOpenChange,
  duplicates,
  onSubmitAnyway,
  isSubmitting,
}: DuplicateDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <IconAlertTriangle className="size-5" />
            Potential Duplicate Detected
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                We found similar questions that may already answer yours. Please
                review them before submitting:
              </p>
              <ul className="space-y-2">
                {duplicates.map((dup) => (
                  <li key={dup.id} className="rounded-md border p-2">
                    <Link
                      href={`/questions/${dup.id}`}
                      target="_blank"
                      className="text-link-100 line-clamp-2 font-medium hover:underline"
                    >
                      {dup.title}
                    </Link>
                    <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                      {dup.titleSimilarity && (
                        <span>Title: {dup.titleSimilarity}% similar</span>
                      )}
                      {dup.contentSimilarity && (
                        <span>Content: {dup.contentSimilarity}% similar</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSubmitAnyway}
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Anyway"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DuplicateDialog;
