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
        <Button className="pg-medium btn-secondary hover:bg-light700_dark300! text-dark300_light900 min-h-12 min-w-40 px-4 py-3 max-sm:w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-light900_dark200 no-scrollbar max-h-[90vh] min-w-[80vw] overflow-y-auto px-10 sm:max-w-[60vw] lg:min-w-3xl">
        <DialogHeader>
          <DialogTitle className="h1-bold text-dark100_light900 text-3xl">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <ProfileForm user={user} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
