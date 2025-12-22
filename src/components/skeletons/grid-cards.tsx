import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface GridCardsSkeletonProps {
  className?: string;
  itemClassName?: string;
}

const GridCardsSkeleton = ({
  className,
  itemClassName,
}: GridCardsSkeletonProps) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-50 w-full rounded-2xl", itemClassName)}
        />
      ))}
    </div>
  );
};

export default GridCardsSkeleton;
