import { Suspense } from "react";

import QuestionContent from "@/components/modules/questions/QuestionContent";
import AnswerForm from "@/components/modules/answers/AnswerForm";
import AnswerList from "@/components/modules/answers/AnswerList";
import QuestionContentSkeleton from "@/components/skeletons/QuestionContentSkeleton";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { filter, page, pageSize, answerId } = await searchParams;
  const currentPage = page ? Number(page) : 1;
  const currentPageSize = pageSize ? Number(pageSize) : 10;

  return (
    <>
      <Suspense fallback={<QuestionContentSkeleton />}>
        <QuestionContent questionId={id} />
      </Suspense>

      <Suspense fallback={<PostCardsSkeleton />}>
        <AnswerList
          questionId={id}
          filter={filter}
          page={currentPage}
          pageSize={currentPageSize}
          answerId={answerId}
        />
      </Suspense>

      <section className="my-5">
        <AnswerForm questionId={id} />
      </section>
    </>
  );
};

export default QuestionDetails;
