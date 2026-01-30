import { orpc } from "@/lib/orpc";
import { safeFetch } from "@/lib/query/helper";
import { getQueryClient } from "@/lib/query/hydration";

import { DataRenderer } from "@/components/shared";
import { EMPTY_ANSWERS, EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/question-card";
import AnswerCard from "@/components/modules/answers/answer-card";
import MarkdownPreview from "@/components/markdown/markdown-preview";

export async function getUserPosts(
  userId: string,
  page: number,
  pageSize: number,
  filter: string
) {
  const queryClient = getQueryClient();

  const [questionsResult, answersResult] = await Promise.all([
    safeFetch(
      queryClient.fetchQuery(
        orpc.users.questions.queryOptions({
          input: { userId, page, pageSize, filter },
        })
      ),
      { error: "Failed to fetch questions" }
    ),
    safeFetch(
      queryClient.fetchQuery(
        orpc.users.answers.queryOptions({
          input: { userId, page, pageSize, filter },
        })
      ),
      { error: "Failed to fetch answers" }
    ),
  ]);

  return { questionsResult, answersResult };
}

interface UserQuestionsProps {
  user: Author;
  data?: {
    questions: Omit<Question, "author">[];
    totalQuestions: number;
  };
  error?: { message: string };
  isAuthor?: boolean;
}

export const UserQuestions = ({
  user,
  data,
  error,
  isAuthor,
}: UserQuestionsProps) => {
  return (
    <DataRenderer
      data={data?.questions ?? []}
      success={!!data}
      error={error}
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
        </div>
      )}
    />
  );
};

interface UserAnswersProps {
  user: Author;
  data?: {
    answers: Omit<Answer, "author">[];
    totalAnswers: number;
  };
  error?: { message: string };
  isAuthor?: boolean;
}

export const UserAnswers = ({
  user,
  data,
  error,
  isAuthor,
}: UserAnswersProps) => {
  return (
    <DataRenderer
      data={data?.answers ?? []}
      success={!!data}
      error={error}
      empty={EMPTY_ANSWERS}
      render={(answers) => (
        <>
          {answers.map((answer) => {
            const previewLength = 240;
            const previewContent =
              answer.content.length > previewLength
                ? answer.content.slice(0, previewLength) + "..."
                : answer.content;

            return (
              <AnswerCard
                {...answer}
                key={answer.id}
                id={answer.id}
                author={user}
                questionId={answer.questionId}
                showDelete={isAuthor}
                expandable={false}
                previewMarkdown={<MarkdownPreview content={previewContent} />}
                fullMarkdown={<MarkdownPreview content={answer.content} />}
                toggleExpand
                className="rounded-md px-3 py-4 sm:px-5"
              />
            );
          })}
        </>
      )}
    />
  );
};
