import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const GridCardsSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full gap-4",
        className,
      )}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
        <Skeleton key={item} className="h-50 w-full rounded-2xl" />
      ))}
    </div>
  );
};

export default GridCardsSkeleton;
