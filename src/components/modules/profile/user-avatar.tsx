import Link from "next/link";
import { Route } from "next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  username?: string;
  name: string | undefined;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
  href?: Route | null;
}

const UserAvatar = ({
  username,
  name,
  image,
  className,
  fallbackClassName,
  href = username ? (`/${username}` as Route) : null,
}: UserAvatarProps) => {
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatar = (
    <Avatar className={cn("relative", className)}>
      <AvatarImage
        src={image ?? (null as unknown as undefined)}
        alt={name}
        className="object-cover"
      />
      <AvatarFallback
        className={cn(
          "primary-gradient font-esbuild no-copy font-bold tracking-wider text-white",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!href) return avatar;

  return (
    <Link href={href} className="cursor-pointer">
      {avatar}
    </Link>
  );
};

export default UserAvatar;
