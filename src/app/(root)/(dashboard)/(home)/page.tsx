import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { FilterProvider } from "@/context";
import { baseUrl } from "@/common/constants";
import { Button } from "@/components/ui/button";
import LocalSearch from "@/components/modules/main/local-search";
import HomeFilter from "@/components/filters/home-filter";
import Filter from "@/components/filters/filter";
import { HomePageFilters } from "@/common/constants/filters";
import FilterContent from "@/components/filters/filter-content";
import { PostCardsSkeleton } from "@/components/skeletons";
import HomeQuestions from "./questions";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Post, search, and filter programming questions from the Dev4Room community. Find solutions, share knowledge, and ask your own questions.",
  openGraph: {
    type: "website",
    title: "Home | Dev4Room",
    description:
      "Post, search, and filter programming questions from the Dev4Room community. Find solutions, share knowledge, and ask your own questions.",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Dev4Room - Programming Q&A Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Dev4Room",
    description:
      "Post, search, and filter programming questions from the Dev4Room community. Find solutions, share knowledge, and ask your own questions.",
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Dev4Room - Programming Q&A Community",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

const HomePage = ({ searchParams }: RouteParams) => {
  return (
    <FilterProvider>
      {/* Ask a question section */}
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient text-light-900! hover:primary-gradient-hover min-h-10 cursor-pointer px-4 py-3"
          asChild
        >
          <Link href="/ask-question">Ask Question</Link>
        </Button>
      </section>

      <section className="mt-10">
        <LocalSearch
          placeholder="Search a question here..."
          className="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          className="mt-6 min-h-12 w-full"
          containerClassName="hidden max-sm:flex"
        />

        <HomeFilter />
      </section>

      <Suspense fallback={<PostCardsSkeleton className="mt-10" />}>
        <FilterContent>
          <HomeQuestions searchParams={searchParams} />
        </FilterContent>
      </Suspense>
    </FilterProvider>
  );
};

export default HomePage;
