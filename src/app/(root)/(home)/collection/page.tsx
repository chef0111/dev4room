import { Suspense } from "react";
import LocalSearch from "@/components/modules/main/LocalSearch";
import { CollectionFilters } from "@/common/constants/filters";
import Filter from "@/components/filters/Filter";
import Collection from "./collection";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";

const CollectionsPage = ({ searchParams }: RouteParams) => {
  return (
    <>
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
        <Collection searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default CollectionsPage;
