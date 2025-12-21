import { db } from "@/database/drizzle";
import { question } from "@/database/schema";

import QuestionContent from "@/components/modules/questions/question-content";
export async function generateStaticParams() {
  const questions = await db.select({ id: question.id }).from(question);
  return questions.map((q) => ({ id: q.id }));
}

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  return <QuestionContent questionId={id} isPending />;
};

export default QuestionDetails;
