import { after } from "next/server";
import { notFound } from "next/navigation";

import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { incrementQuestionViews } from "@/app/server/question/question.dal";
import TagCard from "@/components/layout/tags/TagCard";
import MarkdownPreview from "@/components/editor/MarkdownPreview";
import QuestionHeader from "@/components/layout/questions/QuestionHeader";
import { Separator } from "@/components/ui/separator";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  const result = await queryClient
    .fetchQuery(orpc.question.get.queryOptions({ input: { questionId: id } }))
    .then((data) => ({ data, error: undefined }))
    .catch(() => ({ data: undefined, error: true }));

  if (!result.data) return notFound();

  const question = result.data;
  const { author, createdAt, answers, views, title, content, tags } = question;

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

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag.id} id={tag.id} name={tag.name} compact />
        ))}
      </div>
      <Separator className="bg-light700_dark400 h-1 mt-10" />
    </>
  );
};

export default QuestionDetails;
