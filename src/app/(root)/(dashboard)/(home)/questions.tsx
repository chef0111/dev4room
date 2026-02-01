import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { resolveData, safeFetch } from "@/lib/query/helper";
import { QuestionListOutput } from "@/app/server/question/question.dto";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_QUESTION } from "@/common/constants/states";
import { QuestionCard } from "@/components/modules/questions";
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

  const result = await safeFetch<QuestionListOutput>(
    queryClient.fetchQuery(queryOptions),
    "Failed to get questions"
  );

  const {
    data: questions,
    success,
    error,
  } = resolveData(result, (data) => data.questions, []);

  const { data: totalQuestions } = resolveData(
    result,
    (data) => data.totalQuestions,
    0
  );

  return (
    <>
      <DataRenderer
        data={questions}
        success={success}
        error={error}
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
