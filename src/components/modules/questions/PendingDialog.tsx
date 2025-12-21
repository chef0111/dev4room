"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PendingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PendingDialog = ({ open, onOpenChange }: PendingDialogProps) => {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="background-light900_dark200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-dark100_light900">
            Question Submitted for Review
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dark500_light700">
            Your current reputation score is below the threshold for immediate
            publication. Your question will be submitted for moderation and
            approval shortly. You can track and manage your pending questions in
            the Pending Questions page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              toast.success("Success", {
                description: "Your question has been submitted for review.",
              });
              router.push("/pending-questions");
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PendingDialog;
