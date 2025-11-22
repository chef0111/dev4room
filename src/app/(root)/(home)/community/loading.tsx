import { Skeleton } from "@/components/ui/skeleton";
import GridCardsSkeleton from "@/components/skeletons/GridCardsSkeleton";
import SearchInput from "@/components/layout/main/SearchInput";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <SearchInput
          placeholder="Search some great developers..."
          className="bg-light800_darkgradient! flex-1 min-h-12 gap-2 px-2"
          disabled
        />
        <Skeleton className="h-12 w-40" />
      </div>

      <GridCardsSkeleton className="mt-10" />
    </section>
  );
};

export default Loading;
