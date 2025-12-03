import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const TopTagsSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full flex-col mt-6 gap-4", className)}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} className="h-8 w-full rounded-md" />
      ))}
    </div>
  );
};

export default TopTagsSkeleton;
