import { Spinner } from "@/components/ui";

const ContributionGraphSkeleton = () => {
  return (
    <div className="flex w-max min-w-full flex-col gap-2">
      {/* Calendar skeleton - approximate size of a year calendar */}
      <div className="flex-center h-39.75 min-w-full flex-col gap-1 overflow-x-auto overflow-y-hidden">
        <Spinner className="size-6" />
        <span className="text-muted-foreground text-sm">
          Loading contributions graph...
        </span>
      </div>
    </div>
  );
};

export default ContributionGraphSkeleton;
