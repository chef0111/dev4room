import { notFound, redirect } from "next/navigation";

import QuestionForm from "@/components/modules/questions/QuestionForm";
import { getServerSession } from "@/lib/session";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await getServerSession();
  if (!session) return redirect("/login");

  const queryClient = getQueryClient();
  const queryOptions = orpc.question.get.queryOptions({
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
