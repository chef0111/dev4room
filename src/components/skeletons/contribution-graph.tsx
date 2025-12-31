import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ContributionGraphSkeleton = () => {
  return (
    <div className="flex w-max min-w-full flex-col gap-2">
      {/* Calendar skeleton - approximate size of a year calendar */}
      <div className="min-w-full overflow-x-auto overflow-y-hidden">
        <Skeleton className="h-32.5 w-full rounded-md" />
      </div>

      {/* Footer skeleton */}
      <div className="flex-between flex-wrap gap-1 whitespace-nowrap sm:gap-x-4">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-1.75">
          <span className="text-muted-foreground text-sm">Less</span>
          <div className="flex gap-0.75">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg height={12} key={index} width={12}>
                <rect
                  className={cn(
                    "stroke-border stroke-[1px]",
                    'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                    'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                    'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                    'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                    'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                  )}
                  data-level={index}
                  height={12}
                  rx={2}
                  ry={2}
                  width={12}
                />
              </svg>
            ))}
          </div>
          <span className="text-muted-foreground text-sm">More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraphSkeleton;
