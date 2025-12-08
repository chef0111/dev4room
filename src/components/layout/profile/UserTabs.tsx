import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import { profileTabs } from "@/common/constants";
import { EMPTY_ANSWERS, EMPTY_QUESTION } from "@/common/constants/states";

import DataRenderer from "@/components/shared/DataRenderer";
import { AnimatedTab, NextPagination } from "@/components/ui/dev";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import AnswerCard from "@/components/layout/answers/AnswerCard";
import QuestionCard from "@/components/layout/questions/QuestionCard";
import Filter from "@/components/filters/Filter";
import FilterContent from "@/components/filters/FilterContent";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { UserFilters } from "@/common/constants/filters";
import { FilterProvider } from "@/context";

interface UserTabsProps {
  userId: string;
  user: Author;
  page?: number;
  pageSize?: number;
  filter?: string;
  isAuthor?: boolean;
}

const UserTabs = async ({
  userId,
  user,
  page = 1,
  pageSize = 10,
  filter = "popular",
  isAuthor = false,
}: UserTabsProps) => {
  const queryClient = getQueryClient();

  const [questionsResult, answersResult] = await Promise.all([
    queryClient
      .fetchQuery(
        orpc.user.questions.queryOptions({
          input: {
            userId,
            page,
            pageSize,
            filter,
          },
        }),
      )
      .then((data) => ({ data, error: undefined }))
      .catch((e) => ({
        data: undefined,
        error: { message: getErrorMessage(e, "Failed to fetch questions") },
      })),
    queryClient
      .fetchQuery(
        orpc.user.answers.queryOptions({
          input: {
            userId,
            page,
            pageSize,
          },
        }),
      )
      .then((data) => ({ data, error: undefined }))
      .catch((e) => ({
        data: undefined,
        error: { message: getErrorMessage(e, "Failed to fetch answers") },
      })),
  ]);

  const questions = questionsResult.data?.questions ?? [];
  const totalQuestions = questionsResult.data?.totalQuestions ?? 0;
  const answers = answersResult.data?.answers ?? [];
  const totalAnswers = answersResult.data?.totalAnswers ?? 0;

  return (
    <FilterProvider>
      <Tabs defaultValue={profileTabs[0].value} className="flex-2">
        {/* User Questions & Answers tabs */}
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <TabsList className="bg-light800_dark400 min-h-12 max-sm:w-full p-1 gap-1 rounded-md">
            <AnimatedTab
              defaultValue={profileTabs[0].value}
              className="bg-primary-500 shadow-light-100 rounded-sm"
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
            >
              {profileTabs.map(({ value, label }, index) => (
                <TabsTrigger
                  key={index}
                  value={value}
                  data-id={value}
                  className="tab cursor-pointer p-3"
                >
                  <p className="pg-medium">{label}</p>
                </TabsTrigger>
              ))}
            </AnimatedTab>
          </TabsList>

          <Filter
            filters={UserFilters}
            className="min-h-12 sm:min-w-33 w-full"
          />
        </div>

        {/* Display User Questions */}
        <TabsContent
          value={profileTabs[0].value}
          className="mt-4 flex flex-col w-full gap-6"
        >
          <FilterContent loadingMessage="Loading...">
            <DataRenderer
              data={questions}
              success={!!questionsResult.data}
              error={questionsResult.error}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="mb-10 flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={{
                        ...question,
                        author: user,
                      }}
                      actionButtons={isAuthor}
                    />
                  ))}

                  <NextPagination
                    page={page}
                    pageSize={pageSize}
                    totalCount={totalQuestions}
                    className="pb-6"
                  />
                </div>
              )}
            />
          </FilterContent>
        </TabsContent>

        {/* Display User Answers */}
        <TabsContent
          value="answers"
          className="mt-4 flex flex-col w-full gap-6"
        >
          <FilterContent loadingMessage="Loading...">
            <DataRenderer
              data={answers}
              success={!!answersResult.data}
              error={answersResult.error}
              empty={EMPTY_ANSWERS}
              render={(answers) => (
                <div className="mb-10 flex w-full flex-col">
                  {answers.map((answer) => {
                    const previewContent = answer.content.slice(0, 270) + "...";
                    return (
                      <AnswerCard
                        {...answer}
                        key={answer.id}
                        id={answer.id}
                        author={user}
                        questionId={answer.question.id}
                        isAuthor={isAuthor}
                        showDelete={isAuthor}
                        expandable={false}
                        previewMarkdown={
                          <MarkdownPreview content={previewContent} />
                        }
                        fullMarkdown={
                          <MarkdownPreview content={answer.content} />
                        }
                        shouldShowToggle
                        className="rounded-md px-3 py-4 sm:px-5"
                      />
                    );
                  })}

                  <NextPagination
                    page={page}
                    pageSize={pageSize}
                    totalCount={totalAnswers}
                    className="py-6"
                  />
                </div>
              )}
            />
          </FilterContent>
        </TabsContent>
      </Tabs>
    </FilterProvider>
  );
};

export default UserTabs;
