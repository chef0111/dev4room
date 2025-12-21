import QuestionForm from "@/components/modules/questions/question-form";

const AskQuestion = () => {
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
