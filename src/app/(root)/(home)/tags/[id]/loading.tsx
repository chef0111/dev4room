import { Skeleton } from "@/components/ui/skeleton";
import SearchInput from "@/components/layout/main/SearchInput";
import FilterFallback from "@/components/filters/FilterFallback";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";

const Loading = () => {
  return (
    <section>
      <Skeleton className="mt-2 h-8 w-32" />

      <div className="mt-10.5 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <SearchInput
          placeholder="Search questions..."
          className="bg-light800_darksecondgradient! grow w-full min-h-12 gap-2 px-2"
          disabled
        />
        <FilterFallback />
      </div>

      <PostCardsSkeleton className="mt-10" />
    </section>
  );
};

export default Loading;
