import { Skeleton } from "@/components/ui/skeleton";
import FilterFallback from "../filters/FilterFallback";

const UserTabsSkeleton = () => {
  return (
    <div className="flex-2">
      {/* Tabs skeleton */}
      <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
        <div className="bg-light800_dark400 flex h-12 max-sm:w-full p-1 gap-1 rounded-md">
          <div className="tab-panel">Questions</div>
          <div className="tab-panel">Answers</div>
        </div>

        <FilterFallback />
      </div>

      {/* Content skeleton */}
      <div className="mt-6 flex flex-col w-full gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default UserTabsSkeleton;
