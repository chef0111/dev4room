import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import FilterContent from "@/components/filters/FilterContent";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import DataRenderer from "@/components/shared/DataRenderer";
import { EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/QuestionCard";
import { NextPagination } from "@/components/ui/dev";

const HomeQuestions = async ({ searchParams }: Omit<RouteParams, "params">) => {
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
    <>
      <FilterContent
        fallback={<PostCardsSkeleton className="mt-10" />}
        loadingMessage="Loading..."
      >
        <DataRenderer
          data={data?.questions ?? []}
          success={!!data}
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
    </>
  );
};

export default HomeQuestions;
