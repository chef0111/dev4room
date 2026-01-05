import UserAvatar from "@/components/modules/profile/user-avatar";
import { DevCard } from "@/components/ui/dev";
import Link from "next/link";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

const UserCard = ({ name, username, image }: UserCardProps) => {
  return (
    <DevCard>
      <UserAvatar
        username={username}
        name={name}
        image={image ?? ""}
        className="size-25 rounded-full object-cover"
        fallbackClassName="text-center text-4xl tracking-widest"
      />

      <Link href={`/${username}`}>
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>
      </Link>
    </DevCard>
  );
};

export default UserCard;
