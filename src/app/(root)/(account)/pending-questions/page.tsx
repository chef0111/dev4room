import { Suspense } from "react";
import PendingQuestionsContent from "./pending-questions-content";
import { Spinner } from "@/components/ui/spinner";
import { TextShimmer } from "@/components/ui/dev";

const PendingQuestionsPage = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Pending Questions</h1>

      <Suspense fallback={<PendingQuestionsSkeleton />}>
        <PendingQuestionsContent />
      </Suspense>
    </>
  );
};

function PendingQuestionsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Spinner className="size-8 border-4" />
      <TextShimmer duration={1.5} className="text-lg">
        Loading pending questions...
      </TextShimmer>
    </div>
  );
}

export default PendingQuestionsPage;
