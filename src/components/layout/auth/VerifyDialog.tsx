import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VerifyDialogProps {
  open: boolean;
  onOpenChange: (show: boolean) => void;
  action: boolean;
  onAction: () => void;
}

const VerifyDialog = ({
  open,
  onOpenChange,
  action,
  onAction,
}: VerifyDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-light900_dark200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-dark100_light900">
            Email Not Verified
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dark500_light400">
            Your email address hasn't been verified yet. We'll send you a
            verification code to complete your registration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={action}
            className="bg-light800_dark400 text-dark300_light700 hover:bg-light700_dark300"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            disabled={action}
            className="bg-primary text-light-900"
          >
            {action ? "Sending..." : "Send Verification Code"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyDialog;
