import { redirect } from "next/navigation";

import routes from "@/common/constants/routes";
import QuestionForm from "@/components/layout/questions/QuestionForm";
import { getServerSession } from "@/lib/session";

const AskQuestion = async () => {
  const session = await getServerSession();
  if (!session) return redirect(routes.login);

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
