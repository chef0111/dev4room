import { Activity } from "react";
import { after } from "next/server";
import { notFound } from "next/navigation";

import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { incrementQuestionViews } from "@/app/server/question/question.dal";
import { Separator } from "@/components/ui/separator";
import TagCard from "@/components/layout/tags/TagCard";
import QuestionHeader from "@/components/layout/questions/QuestionHeader";
import MarkdownPreview from "@/components/editor/MarkdownPreview";
import AnswerForm from "@/components/layout/answers/AnswerForm";
import EditDelete from "@/components/shared/EditDelete";
import { getServerSession } from "@/lib/session";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const session = await getServerSession();
  const queryClient = getQueryClient();

  const result = await queryClient
    .fetchQuery(orpc.question.get.queryOptions({ input: { questionId: id } }))
    .then((data) => ({ data, error: undefined }))
    .catch(() => ({ data: undefined, error: true }));

  if (!result.data) return notFound();

  const question = result.data;
  const { author, createdAt, answers, views, title, content, tags } = question;
  const isAuthor = session?.user?.id === author.id.toString();

  after(async () => {
    await incrementQuestionViews(id);
  });

  return (
    <>
      <QuestionHeader
        questionId={question.id}
        authorId={author.id}
        authorName={author.name}
        authorAvatar={author.image ?? undefined}
        title={title}
        createdAt={createdAt}
        answers={answers}
        views={views}
        upvotes={question.upvotes}
        downvotes={question.downvotes}
      />

      <MarkdownPreview content={content} />
      <div className="mt-8 flex-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagCard key={tag.id} id={tag.id} name={tag.name} compact />
          ))}
        </div>

        <Activity mode={isAuthor ? "visible" : "hidden"}>
          <EditDelete type="question" itemId={question.id} />
        </Activity>
      </div>
      <Separator className="bg-light700_dark400 h-1 mt-10" />

      <section className="my-5">
        <AnswerForm
          question={question.id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
