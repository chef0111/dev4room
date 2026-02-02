import { Suspense } from "react";
import { Metadata } from "next";
import { db } from "@/database/drizzle";
import { question, user } from "@/database/schema";
import { eq } from "drizzle-orm";

import QuestionContent from "@/components/modules/questions/question-content";
import { AnswerForm } from "@/components/modules/answers";
import { AnswerList } from "@/components/modules/answers";
import { PostCardsSkeleton } from "@/components/skeletons";

export async function generateStaticParams() {
  const questions = await db.select({ id: question.id }).from(question);
  return questions.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const [questionData] = await db
    .select({
      title: question.title,
      content: question.content,
      authorName: user.name,
    })
    .from(question)
    .leftJoin(user, eq(question.authorId, user.id))
    .where(eq(question.id, id))
    .limit(1);

  if (!questionData) {
    return {
      title: "Question Not Found",
    };
  }

  const description =
    questionData.content.length > 160
      ? questionData.content.slice(0, 157) + "..."
      : questionData.content;

  return {
    title: questionData.title,
    description,
    openGraph: {
      title: `${questionData.title} | Dev4Room`,
      description,
      url: `https://dev4room.pro/questions/${id}`,
      type: "article",
      authors: questionData.authorName ? [questionData.authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${questionData.title} | Dev4Room`,
      description,
    },
    alternates: {
      canonical: `https://dev4room.pro/questions/${id}`,
    },
  };
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
