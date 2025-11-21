import { getCachedServerSession } from "@/lib/session";
import UserAvatar from "../../profile/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Cached user section for Navbar
 * Only caches the user avatar display logic, keeping rest of Navbar static
 * 
 * Cache settings:
 * - Stale: 1 minute
 * - Revalidate: 5 minutes  
 * - Expire: 1 hour
 */
export default async function CachedUserSection() {
  const session = await getCachedServerSession();
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
    />
  );
}

export function UserSectionSkeleton() {
  return <Skeleton className="w-9 h-9 rounded-full" />;
}

