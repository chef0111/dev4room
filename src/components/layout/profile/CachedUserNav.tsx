import { getCachedServerSession } from "@/lib/session";
import { UserNav } from "./UserNav";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CachedUserNav() {
  const session = await getCachedServerSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  if (!user) {
    return null;
  }

  return <UserNav user={user} isAdmin={isAdmin} />;
}

export function UserNavSkeleton() {
  return (
    <div className="w-full flex-between gap-2 rounded-lg p-2">
      <div className="flex-start flex-grow gap-2">
        <Skeleton className="size-8 rounded-lg" />
        <div className="hidden lg:grid gap-1 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
