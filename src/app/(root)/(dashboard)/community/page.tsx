import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterProvider } from "@/context";
import LocalSearch from "@/components/modules/main/local-search";
import Filter from "@/components/filters/filter";
import { UserFilters } from "@/common/constants/filters";
import FilterContent from "@/components/filters/filter-content";
import { GridCardsSkeleton } from "@/components/skeletons";
import Users from "./users";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Browse and search developer profiles on Dev4Room — find contributors, view expertise, and connect with other developers.",
  openGraph: {
    type: "website",
    title: "Community | Dev4Room",
    description:
      "Browse and search developer profiles on Dev4Room — find contributors, view expertise, and connect with other developers.",
    url: "/community",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | Dev4Room",
    description:
      "Browse and search developer profiles on Dev4Room — find contributors, view expertise, and connect with other developers.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "/community",
  },
};

const Community = ({ searchParams }: RouteParams) => {
  return (
    <FilterProvider>
      <div>
        <h1 className="h1-bold text-dark100_light900">All Users</h1>

        <section className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
          <LocalSearch
            placeholder="Search some great developers..."
            className="flex-1 grow"
          />
          <Filter
            filters={UserFilters}
            className="min-h-12 w-full sm:min-w-33"
          />
        </section>

        <Suspense
          fallback={
            <GridCardsSkeleton className="mt-10" itemClassName="h-51" />
          }
        >
          <FilterContent>
            <Users searchParams={searchParams} />
          </FilterContent>
        </Suspense>
      </div>
    </FilterProvider>
  );
};

export default Community;
