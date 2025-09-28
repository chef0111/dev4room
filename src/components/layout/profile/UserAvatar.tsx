import routes from "@/common/constants/routes";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  id: string;
  name: string;
  image?: string | null;
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
    <Link href={routes.profile(id)}>
      <Avatar className={cn("relative", className)}>
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            quality={100}
            className="rounded-full object-cover"
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-gradient font-esbuild font-bold tracking-wider text-white",
              fallbackClassName
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
