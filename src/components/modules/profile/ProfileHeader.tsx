import dayjs from "dayjs";
import { Route } from "next";
import UserAvatar from "@/components/modules/profile/UserAvatar";
import ProfileLink from "./ProfileLink";

interface ProfileHeaderProps {
  id: string;
  name: string;
  username: string;
  image?: string | null;
  portfolio?: string | null;
  location?: string | null;
  createdAt: Date;
  bio?: string | null;
}

const ProfileHeader = ({
  id,
  name,
  username,
  image,
  portfolio,
  location,
  createdAt,
  bio,
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-4 max-sm:flex-row md:flex-row">
      <UserAvatar
        id={id}
        name={name}
        image={image ?? undefined}
        className="size-35 rounded-full object-cover max-sm:size-28"
        fallbackClassName="text-6xl font-bold"
      />

      <div className="mt-2">
        <h2 className="h2-bold text-dark100_light900">{name}</h2>
        <p className="pg-regular text-dark400_light500">@{username}</p>

        <div className="flex-start mt-5 flex-wrap gap-4">
          {portfolio && (
            <ProfileLink
              icon="/icons/link.svg"
              href={portfolio as Route}
              title="Portfolio"
            />
          )}

          {location && (
            <ProfileLink icon="/icons/location.svg" title={location} />
          )}

          <ProfileLink
            icon="/icons/calendar.svg"
            title={`Joined ${dayjs(createdAt).format("MMMM YYYY")}`}
          />
        </div>

        {bio && <p className="pg-regular text-dark400_light800 mt-8">{bio}</p>}
      </div>
    </div>
  );
};

export default ProfileHeader;
