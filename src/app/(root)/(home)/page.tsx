import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { Button } from "@/components/ui/button";
import LocalSearch from "@/components/layout/main/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/layout/questions/QuestionCard";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";

export const metadata: Metadata = {
  title: "Dev4Room | Home",
  description:
    "Post, search, and filter programming questions from the Dev Overflow community. Find solutions, share knowledge, and ask your own questions.",
};

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const HomePage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.question.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 12,
      query,
      filter,
    },
  });

  await queryClient.prefetchQuery(queryOptions);

  const data = queryClient.getQueryData(queryOptions.queryKey);
  const questions = data?.questions;

  const searchPlaceholder = "Search a question here...";

  return (
    <HydrateClient client={queryClient}>
      {/* Ask a question section */}
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-10 px-4 py-3 text-light-900! hover:primary-gradient-hover cursor-pointer"
          asChild
        >
          <Link href="/ask-question">Ask Question</Link>
        </Button>
      </section>
      <section className="mt-10">
        <LocalSearch
          route="/"
          placeholder={searchPlaceholder}
          className="flex-1"
        />
        <HomeFilter />
      </section>

      <div className="flex flex-col my-10 w-full gap-6">
        <Suspense fallback={<PostCardsSkeleton />}>
          {questions?.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default HomePage;
