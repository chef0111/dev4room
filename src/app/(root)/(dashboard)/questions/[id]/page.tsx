import { Suspense } from "react";
import { db } from "@/database/drizzle";
import { question } from "@/database/schema";

import QuestionContent from "@/components/modules/questions/question-content";
import AnswerForm from "@/components/modules/answers/answer-form";
import AnswerList from "@/components/modules/answers/answer-list";
import { PostCardsSkeleton } from "@/components/skeletons";

export async function generateStaticParams() {
  const questions = await db.select({ id: question.id }).from(question);
  return questions.map((q) => ({ id: q.id }));
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { filter, page, pageSize, answerId } = await searchParams;
  const currentPage = page ? Number(page) : 1;
  const currentPageSize = pageSize ? Number(pageSize) : 10;

  return (
    <>
      <QuestionContent questionId={id} />

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
