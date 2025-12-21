import { Skeleton } from "@/components/ui/skeleton";
import FilterFallback from "@/components/filters/filter-fallback";

const UserTabsSkeleton = () => {
  return (
    <div className="flex-2">
      {/* Tabs skeleton */}
      <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <div className="bg-light800_dark400 flex h-11 gap-1 rounded-md p-1 max-sm:w-full">
          <div className="tab-panel">Questions</div>
          <div className="tab-panel">Answers</div>
        </div>

        <FilterFallback className="h-11!" />
      </div>

      {/* Content skeleton */}
      <div className="mt-6 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default UserTabsSkeleton;
