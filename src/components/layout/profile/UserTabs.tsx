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

interface UserTabsProps {
  userId: string;
  user: Author;
  page?: number;
  pageSize?: number;
  isOwner?: boolean;
}

const UserTabs = async ({
  userId,
  user,
  page = 1,
  pageSize = 10,
  isOwner = false,
}: UserTabsProps) => {
  const queryClient = getQueryClient();

  const questionsResult = await queryClient
    .fetchQuery(
      orpc.user.questions.queryOptions({
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
      error: { message: getErrorMessage(e, "Failed to fetch questions") },
    }));

  const answersResult = await queryClient
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
    }));

  const questions = questionsResult.data?.questions ?? [];
  const totalQuestions = questionsResult.data?.totalQuestions ?? 0;
  const answers = answersResult.data?.answers ?? [];
  const totalAnswers = answersResult.data?.totalAnswers ?? 0;

  return (
    <Tabs defaultValue={profileTabs[0].value} className="flex-2">
      {/* User Questions & Answers tabs */}
      <TabsList className="bg-light800_dark400 min-h-11 p-1 gap-1 rounded-md">
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

      {/* Display User Questions */}
      <TabsContent
        value={profileTabs[0].value}
        className="mt-4 flex flex-col w-full gap-6"
      >
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
                  actionButtons={isOwner}
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
      </TabsContent>

      {/* Display User Answers */}
      <TabsContent value="answers" className="mt-4 flex flex-col w-full gap-6">
        <DataRenderer
          data={answers}
          success={!!answersResult.data}
          error={answersResult.error}
          empty={EMPTY_ANSWERS}
          render={(answers) => (
            <div className="mb-10 flex w-full flex-col">
              {answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  id={answer.id}
                  author={user}
                  content={`${answer.content.slice(0, 270)}...`}
                  createdAt={answer.createdAt}
                  upvotes={answer.upvotes}
                  downvotes={answer.downvotes}
                  question={answer.question}
                  className="rounded-md px-3 py-4 sm:px-5"
                  showReadMore
                  actionButtons={isOwner}
                />
              ))}

              <NextPagination
                page={page}
                pageSize={pageSize}
                totalCount={totalAnswers}
                className="py-6"
              />
            </div>
          )}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;
