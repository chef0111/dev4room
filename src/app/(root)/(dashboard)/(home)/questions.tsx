import { getQuestions } from "@/app/server/question/question.dal";
import { getErrorMessage } from "@/lib/handlers/error";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/question-card";
import { NextPagination } from "@/components/ui/dev";

async function fetchQuestions(
  page: number,
  pageSize: number,
  query?: string,
  filter?: string
) {
  "use cache";

  return await getQuestions({ page, pageSize, query, filter })
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as
        | { questions: Question[]; totalQuestions: number }
        | undefined,
      error: { message: getErrorMessage(e, "Failed to get questions") },
    }));
}

export const HomeQuestions = async ({
  searchParams,
}: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const result = await fetchQuestions(
    Number(page) || 1,
    Number(pageSize) || 10,
    query,
    filter
  );

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
