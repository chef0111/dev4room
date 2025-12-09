"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui";
import { AlertTriangle } from "lucide-react";

interface AIValidationAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

const AIValidationAlert = ({
  open,
  onOpenChange,
  message,
}: AIValidationAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-light900_dark200">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="size-5 text-yellow-600" />
            Answer Not Accepted
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dark400_light700">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="primary-gradient hover:primary-gradient-hover text-light-900 cursor-pointer"
          >
            Try Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AIValidationAlert;
