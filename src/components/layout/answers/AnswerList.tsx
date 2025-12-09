import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getServerSession } from "@/lib/session";
import { getErrorMessage } from "@/lib/handlers/error";
import { AnswerFilters } from "@/common/constants/filters";
import { EMPTY_ANSWERS } from "@/common/constants/states";
import Filter from "@/components/filters/Filter";
import FilterContent from "@/components/filters/FilterContent";
import DataRenderer from "@/components/shared/DataRenderer";
import { FilterProvider } from "@/context";
import { NextPagination } from "@/components/ui/dev";
import AnswerCard from "./AnswerCard";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";

interface AnswerListProps {
  questionId: string;
  totalAnswers: number;
  filter?: string;
  page?: number;
  pageSize?: number;
}

const AnswerList = async ({
  questionId,
  totalAnswers,
  filter,
  page = 1,
  pageSize = 10,
}: AnswerListProps) => {
  const session = await getServerSession();
  const queryClient = getQueryClient();

  const queryOptions = orpc.answer.list.queryOptions({
    input: {
      questionId,
      page,
      pageSize,
      filter: filter as "latest" | "oldest" | "popular" | undefined,
    },
  });

  const result = await queryClient
    .fetchQuery(queryOptions)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get answers") },
    }));

  const data = result.data;

  return (
    <FilterProvider>
      <div className="mt-8">
        <div className="flex-between mb-5">
          <h3 className="h3-semibold text-dark200_light900">
            {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
          </h3>

          <Filter filters={AnswerFilters} className="min-h-10 sm:min-w-33" />
        </div>

        <FilterContent loadingMessage="Loading...">
          <DataRenderer
            success={!!data}
            error={result.error}
            data={data?.answers}
            empty={EMPTY_ANSWERS}
            render={(answers) => (
              <div className="flex flex-col gap-4">
                {answers.map((answer) => {
                  const content = answer.content;
                  const previewLength = 240;
                  const toggleExpand = content.length > previewLength;
                  const previewContent = toggleExpand
                    ? content.slice(0, previewLength) + "..."
                    : content;

                  const isAuthor = session?.user?.id === answer.author.id;

                  return (
                    <AnswerCard
                      {...answer}
                      key={answer.id}
                      id={answer.id}
                      questionId={questionId}
                      previewMarkdown={
                        <MarkdownPreview content={previewContent} />
                      }
                      fullMarkdown={
                        <MarkdownPreview content={answer.content} />
                      }
                      toggleExpand={toggleExpand}
                      showEdit={isAuthor}
                      showDelete={isAuthor}
                      expandable
                    />
                  );
                })}
              </div>
            )}
          />
        </FilterContent>

        <NextPagination
          page={String(page)}
          pageSize={String(pageSize)}
          totalCount={totalAnswers}
          className="pt-6"
        />
      </div>
    </FilterProvider>
  );
};

export default AnswerList;
