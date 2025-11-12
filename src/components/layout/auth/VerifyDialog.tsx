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

interface DialogProps {
  open: boolean;
  onOpenChange: (show: boolean) => void;
  disabled: boolean;
  onClick: () => void;
}

const VerifyDialog = ({
  open,
  onOpenChange,
  disabled,
  onClick,
}: DialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-light900_dark200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-dark100_light900">
            Email Not Verified
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dark500_light400">
            Your email address hasn&apos;t been verified yet. We&apos;ll send
            you a verification code to complete your registration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={disabled}
            className="bg-light800_dark400 text-dark300_light700 hover:bg-light700_dark300"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            disabled={disabled}
            className="bg-primary text-light-900"
          >
            {disabled ? "Sending..." : "Send Verification Code"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyDialog;
