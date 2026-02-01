import { orpc } from "@/lib/orpc";
import { safeFetch } from "@/lib/query/helper";
import { getQueryClient } from "@/lib/query/hydration";
import {
  GetUserAnswersDTO,
  GetUserQuestionsDTO,
} from "@/app/server/user/user.dto";

import { DataRenderer } from "@/components/shared";
import { EMPTY_ANSWERS, EMPTY_QUESTION } from "@/common/constants/states";
import { QuestionCard } from "@/components/modules/questions";
import { AnswerCard } from "@/components/modules/answers";
import MarkdownPreview from "@/components/markdown/markdown-preview";

export async function getUserPosts(
  userId: string,
  page: number,
  pageSize: number,
  filter: string
) {
  const queryClient = getQueryClient();

  const [questionsResult, answersResult] = await Promise.all([
    safeFetch<GetUserQuestionsDTO>(
      queryClient.fetchQuery(
        orpc.users.questions.queryOptions({
          input: { userId, page, pageSize, filter },
        })
      ),
      "Failed to fetch questions"
    ),
    safeFetch<GetUserAnswersDTO>(
      queryClient.fetchQuery(
        orpc.users.answers.queryOptions({
          input: { userId, page, pageSize, filter },
        })
      ),
      "Failed to fetch answers"
    ),
  ]);

  return { questionsResult, answersResult };
}

interface UserQuestionsProps {
  user: Author;
  questions: Omit<Question, "author">[];
  success: boolean;
  error?: { message: string };
  isAuthor?: boolean;
}

export const UserQuestions = ({
  user,
  questions,
  success,
  error,
  isAuthor,
}: UserQuestionsProps) => {
  return (
    <DataRenderer
      data={questions}
      success={success}
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
  answers: Omit<Answer, "author">[];
  success: boolean;
  error?: { message: string };
  isAuthor?: boolean;
}

export const UserAnswers = ({
  user,
  answers,
  success,
  error,
  isAuthor,
}: UserAnswersProps) => {
  return (
    <DataRenderer
      data={answers}
      success={success}
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
