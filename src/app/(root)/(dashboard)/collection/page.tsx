import { Suspense } from "react";
import { FilterProvider } from "@/context";
import LocalSearch from "@/components/modules/main/local-search";
import { CollectionFilters } from "@/common/constants/filters";
import Filter from "@/components/filters/filter";
import FilterContent from "@/components/filters/filter-content";
import { PostCardsSkeleton } from "@/components/skeletons";
import Collection from "./collection";

const CollectionsPage = ({ searchParams }: RouteParams) => {
  return (
    <FilterProvider>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collection"
          placeholder="Search a bookmarked question..."
          className="flex-1"
        />

        <Filter
          filters={CollectionFilters}
          className="min-h-12 w-full sm:min-w-44"
        />
      </div>

      <Suspense fallback={<PostCardsSkeleton className="mt-10" />}>
        <FilterContent
          fallback={<PostCardsSkeleton className="mt-10" />}
          loadingMessage="Loading..."
        >
          <Collection searchParams={searchParams} />
        </FilterContent>
      </Suspense>
    </FilterProvider>
  );
};

export default CollectionsPage;
