"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banReason: string;
  onBanReasonChange: (reason: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function BanUserDialog({
  open,
  onOpenChange,
  banReason,
  onBanReasonChange,
  onConfirm,
  isPending,
}: BanUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Please provide a reason for banning this user. This action can be
            reversed later.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Label htmlFor="ban-reason">Reason (min 10 characters)</Label>
          <Textarea
            id="ban-reason"
            placeholder="Enter the reason for banning this user..."
            value={banReason}
            onChange={(e) => onBanReasonChange(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={banReason.length < 10 || isPending}
          >
            {isPending ? "Banning..." : "Ban User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
