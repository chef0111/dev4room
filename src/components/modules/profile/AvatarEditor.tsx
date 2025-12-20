"use client";

import { useRef } from "react";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Spinner,
} from "@/components/ui";
import { Edit2 } from "lucide-react";
import { useUploadAvatar, useRemoveAvatar } from "@/queries/upload.queries";
import { toast } from "sonner";

interface AvatarEditorProps {
  user: {
    id: string | null;
    name: string | null;
    image: string | null;
  };
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 1024 * 1024; // 1MB

const AvatarEditor = ({ user }: AvatarEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isUploading } = useUploadAvatar();
  const removeAvatarMutation = useRemoveAvatar();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 1MB");
      return;
    }

    try {
      await uploadAvatar(file);
    } catch {
      // Error handled in mutation hook
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    if (!user.image) {
      toast.info("No profile picture to remove");
      return;
    }
    removeAvatarMutation.mutate({});
  };

  const isLoading = isUploading || removeAvatarMutation.isPending;

  return (
    <div className="relative">
      <Input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          className="rounded-full focus:outline-none"
          disabled={isLoading}
        >
          <div className="relative">
            <UserAvatar
              href={null}
              id={user.id ?? ""}
              name={user.name ?? ""}
              image={user.image ?? null}
              className="size-40 rounded-full object-cover md:size-48"
              fallbackClassName="text-7xl md:text-8xl font-bold"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Spinner className="size-8 border-5 border-white/30 border-t-white" />
              </div>
            )}
          </div>
          <div className="flex-between btn-tertiary hover:bg-accent! text-dark200_light800 light-border-2 absolute top-35 ml-9.5 gap-2.5 rounded-md border px-4 py-2 text-sm font-medium md:top-43 md:ml-13.25">
            <Edit2 size={16} />
            Edit
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-5 min-w-0!">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleUploadClick}
            disabled={isLoading}
          >
            Upload a photo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleRemovePhoto}
            disabled={isLoading || !user.image}
          >
            Remove photo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AvatarEditor;
