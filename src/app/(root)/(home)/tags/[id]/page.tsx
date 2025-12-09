import { TagQuestionsFilters } from "@/common/constants/filters";
import { EMPTY_QUESTION } from "@/common/constants/states";
import Filter from "@/components/filters/Filter";
import FilterContent from "@/components/filters/FilterContent";
import LocalSearch from "@/components/modules/main/LocalSearch";
import QuestionCard from "@/components/modules/questions/QuestionCard";
import DataRenderer from "@/components/shared/DataRenderer";
import { NextPagination } from "@/components/ui/dev";
import { FilterProvider } from "@/context";
import { getErrorMessage } from "@/lib/handlers/error";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";

const TagQuestions = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.tag.getQuestions.queryOptions({
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
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>

      <section className="mt-10 flex justify-between sm:items-center max-sm:flex-col gap-4">
        <LocalSearch
          route={`/tags/${id}`}
          placeholder="Search questions..."
          className="flex-1"
        />

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

export default TagQuestions;
