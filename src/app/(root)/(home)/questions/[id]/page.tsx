import { Suspense } from "react";
import { after } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";

import { orpc } from "@/lib/orpc";
import { getServerSession } from "@/lib/session";
import { getQueryClient } from "@/lib/query/hydration";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { ViewService } from "@/services/view.service";

import UserAvatar from "@/components/layout/profile/UserAvatar";
import Votes from "@/components/shared/Votes";
import SaveQuestion from "@/components/layout/questions/SaveQuestion";
import TagCard from "@/components/layout/tags/TagCard";
import EditDelete from "@/components/shared/EditDelete";
import { Separator } from "@/components/ui/separator";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import AnswerForm from "@/components/layout/answers/AnswerForm";
import Metric from "@/components/shared/Metric";
import QuestionUtilsFallback from "@/components/layout/questions/QuestionUtilsFallback";

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
    await ViewService.incrementQuestionViews(id);
  });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full justify-between">
          <div className="flex-start gap-1">
            <UserAvatar
              id={author.id}
              name={author.name}
              image={author.image ?? ""}
              className="size-6"
              fallbackClassName="text-2.5"
            />

            <Link href={`/profile/${author.id}`}>
              <p className="pg-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>

          <div className="flex-end gap-2">
            <Suspense fallback={<QuestionUtilsFallback />}>
              <Votes
                targetType="question"
                targetId={question.id}
                upvotes={question.upvotes}
                downvotes={question.downvotes}
              />

              <SaveQuestion questionId={question.id} />
            </Suspense>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3 w-full">
          {title}
        </h2>
      </div>

      <div className="mb-8 mt-4 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock"
          value={` Asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <MarkdownPreview content={content} />

      <div className="mt-8 flex-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagCard key={tag.id} id={tag.id} name={tag.name} compact />
          ))}
        </div>

        {isAuthor && <EditDelete type="question" itemId={question.id} />}
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
