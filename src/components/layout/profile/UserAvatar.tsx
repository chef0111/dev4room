import routes from "@/common/constants/routes";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  id: string;
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  image,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={routes.profile(id)} className="cursor-pointer">
      <Avatar className={cn("relative", className)}>
        <AvatarImage src={image} alt={name} className="object-cover" />
        <AvatarFallback
          className={cn(
            "primary-gradient font-esbuild font-bold tracking-wider text-white",
            fallbackClassName,
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
