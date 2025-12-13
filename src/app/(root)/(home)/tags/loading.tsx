import GridCardsSkeleton from "@/components/skeletons/GridCardsSkeleton";
import SearchInput from "@/components/modules/main/SearchInput";
import FilterFallback from "@/components/filters/FilterFallback";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <SearchInput
          placeholder="Search tags..."
          className="bg-light800_darksecondgradient! min-h-12 w-full grow gap-2 px-2"
          disabled
        />
        <FilterFallback />
      </div>

      <GridCardsSkeleton className="mt-10" itemClassName="h-41" />
    </section>
  );
};

export default Loading;
