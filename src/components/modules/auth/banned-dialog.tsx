import { ShieldX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BannedDialogProps {
  open: boolean;
  onOpenChange: (show: boolean) => void;
  banReason?: string | null;
}

const BannedDialog = ({ open, onOpenChange, banReason }: BannedDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-light900_dark200">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldX className="size-6 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogTitle className="text-dark100_light900">
            Account Suspended
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dark500_light400">
            Your account has been suspended and you cannot log in.
            {banReason && (
              <span className="mt-2 block rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                <strong>Reason:</strong> {banReason}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel className="bg-light800_dark400 text-dark300_light700 hover:bg-light700_dark300">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BannedDialog;
