import { orpc } from "@/lib/orpc";
import { safeFetch } from "@/lib/query/helper";
import { getQueryClient } from "@/lib/query/hydration";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/question-card";
import { NextPagination } from "@/components/ui/dev";

const HomeQuestions = async ({
  searchParams,
}: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.questions.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      query,
      filter,
    },
  });

  const result = await safeFetch(queryClient.fetchQuery(queryOptions), {
    error: "Failed to get questions",
  });

  const data = result.data;
  const totalQuestions = data?.totalQuestions || 0;

  return (
    <>
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
