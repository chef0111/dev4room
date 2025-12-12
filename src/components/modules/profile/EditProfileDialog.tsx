"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import ProfileForm from "./ProfileForm";

interface EditProfileDialogProps {
  user: {
    id: string;
    name: string;
    username: string;
    portfolio: string | null;
    location: string | null;
    bio: string | null;
  };
}

const EditProfileDialog = ({ user }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="pg-medium btn-secondary hover:bg-light700_dark300! text-dark300_light900 min-h-12 min-w-40 max-sm:w-full px-4 py-3">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-light900_dark200 lg:min-w-3xl sm:max-w-[60vw] min-w-[80vw] max-h-[90vh] overflow-y-auto no-scrollbar px-10">
        <DialogHeader>
          <DialogTitle className="h1-bold text-3xl text-dark100_light900">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <ProfileForm user={user} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
