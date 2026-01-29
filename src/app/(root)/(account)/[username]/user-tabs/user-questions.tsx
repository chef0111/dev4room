import { getUserQuestions } from "@/app/server/user/user.dal";
import { getErrorMessage } from "@/lib/handlers/error";
import { DataRenderer } from "@/components/shared";
import { EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/question-card";

interface UserQuestionsProps {
  user: Author;
  data?: {
    questions: Omit<Question, "author">[];
    totalQuestions: number;
  };
  error?: { message: string };
  isAuthor?: boolean;
}

export async function fetchUserQuestions(
  userId: string,
  page: number,
  pageSize: number,
  filter: string
) {
  "use cache";

  return await getUserQuestions({ userId, page, pageSize, filter })
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as
        | { questions: Question[]; totalQuestions: number }
        | undefined,
      error: { message: getErrorMessage(e, "Failed to fetch user questions") },
    }));
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
