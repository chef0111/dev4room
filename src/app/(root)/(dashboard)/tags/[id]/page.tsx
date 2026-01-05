import { db } from "@/database/drizzle";
import { tag } from "@/database/schema";
import { TagQuestionsFilters } from "@/common/constants/filters";
import { EMPTY_QUESTION } from "@/common/constants/states";

import Filter from "@/components/filters/filter";
import FilterContent from "@/components/filters/filter-content";
import LocalSearch from "@/components/modules/main/local-search";
import QuestionCard from "@/components/modules/questions/question-card";
import DataRenderer from "@/components/shared/data-renderer";
import { NextPagination } from "@/components/ui/dev";
import { FilterProvider } from "@/context";
import { getErrorMessage } from "@/lib/handlers/error";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";

export async function generateStaticParams() {
  const tags = await db.select({ id: tag.id }).from(tag);
  return tags.map((t) => ({ id: t.id }));
}

const TagQuestions = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.tags.getQuestions.queryOptions({
    input: {
      tagId: id,
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
      error: { message: getErrorMessage(e, "Failed to get tag's questions") },
    }));

  const tag = result.data?.tag;
  const questions = result.data?.questions;
  const totalQuestions = result.data?.totalQuestions || 0;

  return (
    <FilterProvider>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>

      <section className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch placeholder="Search questions..." className="flex-1" />

        <Filter
          filters={TagQuestionsFilters}
          className="min-h-12 w-full sm:min-w-33"
        />
      </section>

      <FilterContent loadingMessage="Loading...">
        <DataRenderer
          data={questions}
          success={!!result.data}
          error={result.error}
          empty={EMPTY_QUESTION}
          render={(questions) => (
            <div className="my-10 flex w-full flex-col gap-6">
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

export default TagQuestions;
