import { Edit2 } from "lucide-react";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

interface AvatarEditorProps {
  user: {
    id: string | null;
    name: string | null;
    image: string | null;
  };
}

const AvatarEditor = ({ user }: AvatarEditorProps) => {
  return (
    <div className="aboslute">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus:outline-none">
          <UserAvatar
            href={null}
            id={user.id ?? ""}
            name={user.name ?? ""}
            image={user.image ?? ""}
            className="size-40 rounded-full object-cover md:size-48"
            fallbackClassName="text-7xl md:text-8xl font-bold"
          />
          <div className="flex-between btn-tertiary hover:bg-accent! text-dark200_light800 light-border-2 absolute top-113 ml-9.5 gap-2.5 rounded-md border px-4 py-2 text-sm font-medium md:mt-8 md:ml-13.25">
            <Edit2 size={16} />
            Edit
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-6 min-w-0!">
          <DropdownMenuItem className="cursor-pointer">
            Upload a photo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            Remove photo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AvatarEditor;
