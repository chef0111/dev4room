import SearchInput from "@/components/modules/main/SearchInput";
import FilterFallback from "@/components/filters/FilterFallback";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <SearchInput
          placeholder="Search a bookmarked question..."
          className="bg-light800_darksecondgradient! grow w-full min-h-12 gap-2 px-2"
          disabled
        />
        <FilterFallback className="min-w-44" />
      </div>

      <PostCardsSkeleton className="mt-10" />
    </section>
  );
};

export default Loading;
