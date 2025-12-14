import { Suspense } from "react";
import { FilterProvider } from "@/context";
import LocalSearch from "@/components/modules/main/LocalSearch";
import Filter from "@/components/filters/Filter";
import { TagFilters } from "@/common/constants/filters";
import GridCardsSkeleton from "@/components/skeletons/GridCardsSkeleton";
import Tags from "./tags";

const TagsPage = ({ searchParams }: RouteParams) => {
  return (
    <FilterProvider>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          placeholder={"Search tags..."}
          className="flex-1"
        />

        <Filter filters={TagFilters} className="min-h-12 w-full sm:min-w-33" />
      </section>

      <Suspense
        fallback={<GridCardsSkeleton className="mt-10" itemClassName="h-41" />}
      >
        <Tags searchParams={searchParams} />
      </Suspense>
    </FilterProvider>
  );
};

export default TagsPage;
