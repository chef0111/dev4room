import { Metadata } from "next";
import Link from "next/link";

import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import { EMPTY_QUESTION } from "@/common/constants/states";

import { Button } from "@/components/ui";
import { NextPagination } from "@/components/ui/dev";
import LocalSearch from "@/components/layout/main/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/layout/questions/QuestionCard";
import DataRenderer from "@/components/shared/DataRenderer";
import Filter from "@/components/filters/Filter";
import { HomePageFilters } from "@/common/constants/filters";
import { FilterProvider } from "@/context";
import FilterContent from "@/components/filters/FilterContent";

export const metadata: Metadata = {
  title: "Dev4Room | Home",
  description:
    "Post, search, and filter programming questions from the Dev4Room community. Find solutions, share knowledge, and ask your own questions.",
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
      pageSize: Number(pageSize) || 10,
      query,
      filter,
    },
  });

  const result = await queryClient
    .fetchQuery(queryOptions)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get questions") },
    }));

  const data = result.data;
  const totalQuestions = data?.totalQuestions || 0;

  return (
    <FilterProvider>
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

      <FilterContent loadingMessage="Loading...">
        <DataRenderer
          data={data?.questions ?? []}
          success={!!data}
          error={result.error}
          empty={EMPTY_QUESTION}
          render={(questions) => (
            <div className="flex flex-col my-10 w-full gap-6">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        />
      </FilterContent>

      <NextPagination
        page={page}
        pageSize={pageSize}
        totalCount={totalQuestions}
        className="pb-10"
      />
    </FilterProvider>
  );
};

export default HomePage;
