import { redirect } from "next/navigation";

import QuestionForm from "@/components/modules/questions/QuestionForm";
import { getServerSession } from "@/lib/session";

const AskQuestion = async () => {
  const session = await getServerSession();
  if (!session) return redirect("/login");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a public Question</h1>

      <div className="mt-8">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskQuestion;
