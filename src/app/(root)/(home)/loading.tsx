import { HomePageFilters } from "@/common/constants/filters";
import FilterFallback from "@/components/filters/FilterFallback";
import SearchInput from "@/components/layout/main/SearchInput";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import { Button } from "@/components/ui";

const HomeLoading = () => {
  return (
    <>
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="primary-gradient min-h-10 px-4 py-3 text-light-900! pointer-events-none">
          Ask Question
        </Button>
      </section>
      <section className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <SearchInput
          placeholder="Search a question here..."
          className="bg-light800_darkgradient! flex-1 min-h-12 gap-2 px-2"
          disabled
        />
      </section>

      <FilterFallback className="mt-6 sm:hidden" />

      <div className="mt-6 hidden sm:flex flex-wrap gap-3">
        {HomePageFilters.map((filter) => (
          <Button
            key={filter.label}
            className="base-filter-btn bg-light800_dark300 text-light-500"
            disabled
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <PostCardsSkeleton className="mt-10" />
    </>
  );
};

export default HomeLoading;
