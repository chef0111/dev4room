import { notFound, redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { question } from "@/database/schema";

import { orpc } from "@/lib/orpc";
import { getServerSession } from "@/lib/session";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { QuestionForm } from "@/components/modules/questions";

export async function generateStaticParams() {
  const questions = await db.select({ id: question.id }).from(question);
  return questions.map((q) => ({ id: q.id }));
}

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await getServerSession();
  if (!session) return redirect("/login");

  const queryClient = getQueryClient();
  const queryOptions = orpc.questions.get.queryOptions({
    input: { questionId: id },
  });

  await queryClient.prefetchQuery(queryOptions);
  const question = queryClient.getQueryData(queryOptions.queryKey);

  if (question?.author.id.toString() !== session?.user?.id)
    redirect(`/questions/${id}`);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-8">
        <HydrateClient client={queryClient}>
          <QuestionForm question={question} isEdit />
        </HydrateClient>
      </div>
    </>
  );
};

export default EditQuestion;
