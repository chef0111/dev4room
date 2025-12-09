import { getServerSession } from "@/lib/session";
import UserAvatar from "../../profile/UserAvatar";

export default async function UserSection() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.id) {
    return null;
  }

  return (
    <UserAvatar
      id={user.id}
      name={user.name!}
      image={user.image ?? ""}
      className="w-9 h-9 rounded-full"
      aria-label="User avatar"
    />
  );
}
