import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const TopTagsSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("mt-6 flex w-full flex-col gap-4", className)}>
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex-between">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-7 w-12 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default TopTagsSkeleton;
