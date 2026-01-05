import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import DataRenderer from "@/components/shared/data-renderer";
import PendingQuestionsList from "./pending-questions-list";

const EMPTY_PENDING = {
  title: "No pending questions",
  message:
    "All your questions have been reviewed or you haven't submitted any yet.",
  link: { href: "/ask-question", label: "Ask a Question" },
};

const PendingQuestionsContent = async () => {
  const queryClient = getQueryClient();

  const queryOptions = orpc.questions.pending.queryOptions({
    input: undefined,
  });

  const result = await queryClient
    .fetchQuery(queryOptions)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get pending questions") },
    }));

  const data = result.data;

  return (
    <DataRenderer
      success={!!data}
      error={result.error}
      data={data}
      empty={EMPTY_PENDING}
      render={(questions) => <PendingQuestionsList questions={questions} />}
    />
  );
};

export default PendingQuestionsContent;
