import UserAvatar from "@/components/modules/profile/UserAvatar";
import { authClient } from "@/lib/auth-client";

export default function UserSection() {
  const session = authClient.useSession();
  const user = session.data?.user;

  if (!user?.id) {
    return null;
  }

  return (
    <UserAvatar
      id={user.id}
      name={user.name}
      image={user.image ?? ""}
      className="h-9 w-9 rounded-full"
      aria-label="User avatar"
    />
  );
}
