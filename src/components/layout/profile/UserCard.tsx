import routes from "@/common/constants/routes";
import UserAvatar from "@/components/layout/profile/UserAvatar";
import DevCard from "@/components/shared/DevCard";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

const UserCard = ({ id, name, username, image }: UserCardProps) => {
  return (
    <DevCard>
      <UserAvatar
        id={id}
        name={name}
        image={image ?? ""}
        className="size-25 rounded-full object-cover"
        fallbackClassName="text-center text-4xl tracking-widest"
      />

      <Link href={routes.profile(id)}>
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>
      </Link>
    </DevCard>
  );
};

export default UserCard;
