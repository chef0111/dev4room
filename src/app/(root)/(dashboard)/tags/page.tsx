import { Suspense } from "react";
import type { Metadata } from "next";
import { baseUrl } from "@/common/constants";
import { FilterProvider } from "@/context";
import LocalSearch from "@/components/modules/main/local-search";
import Filter from "@/components/filters/filter";
import { TagFilters } from "@/common/constants/filters";
import FilterContent from "@/components/filters/filter-content";
import { GridCardsSkeleton } from "@/components/skeletons";
import Tags from "./tags";

export const metadata: Metadata = {
  title: "Tags",
  description:
    "Explore tags on Dev4Room to find questions and experts by technology, language, and topic. Discover trending tags and related content.",
  openGraph: {
    title: "Tags | Dev4Room",
    description:
      "Explore tags on Dev4Room to find questions and experts by technology, language, and topic. Discover trending tags and related content.",
    url: `${baseUrl}/tags`,
  },
  twitter: {
    title: "Tags | Dev4Room",
    description:
      "Explore tags on Dev4Room to find questions and experts by technology, language, and topic. Discover trending tags and related content.",
  },
  alternates: {
    canonical: `${baseUrl}/tags`,
  },
};

const TagsPage = ({ searchParams }: RouteParams) => {
  return (
    <FilterProvider>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch placeholder={"Search tags..."} className="flex-1" />

        <Filter filters={TagFilters} className="min-h-12 w-full sm:min-w-33" />
      </section>

      <Suspense
        fallback={<GridCardsSkeleton className="mt-10" itemClassName="h-41" />}
      >
        <FilterContent>
          <Tags searchParams={searchParams} />
        </FilterContent>
      </Suspense>
    </FilterProvider>
  );
};

export default TagsPage;
