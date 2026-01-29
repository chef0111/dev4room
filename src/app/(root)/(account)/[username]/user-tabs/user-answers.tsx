import { getUserAnswers } from "@/app/server/user/user.dal";
import { EMPTY_ANSWERS } from "@/common/constants/states";
import MarkdownPreview from "@/components/markdown/markdown-preview";
import AnswerCard from "@/components/modules/answers/answer-card";
import { DataRenderer } from "@/components/shared";
import { getErrorMessage } from "@/lib/handlers/error";

interface UserAnswersProps {
  user: Author;
  data?: {
    answers: Omit<Answer, "author">[];
    totalAnswers: number;
  };
  error?: { message: string };
  isAuthor?: boolean;
}

export async function fetchUserAnswers(
  userId: string,
  page: number,
  pageSize: number,
  filter: string
) {
  "use cache";

  return await getUserAnswers({ userId, page, pageSize, filter })
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as
        | { answers: Answer[]; totalAnswers: number }
        | undefined,
      error: { message: getErrorMessage(e, "Failed to fetch user answers") },
    }));
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
