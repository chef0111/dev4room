import { Suspense } from "react";
import { after } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { orpc } from "@/lib/orpc";
import { getServerSession } from "@/lib/session";
import { getQueryClient } from "@/lib/query/hydration";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { ViewService } from "@/services/view.service";
import UserAvatar from "@/components/modules/profile/user-avatar";
import Votes from "@/components/modules/vote/votes";
import SaveQuestion from "@/components/modules/questions/save-question";
import TagCard from "@/components/modules/tags/tag-card";
import EditDelete from "@/components/shared/edit-delete";
import { Separator } from "@/components/ui/separator";
import MarkdownPreview from "@/components/markdown/markdown-preview";
import { Metric } from "@/components/shared";
import QuestionUtilsFallback from "@/components/modules/questions/question-utils-fallback";

interface QuestionContentProps {
  questionId: string;
  isPending?: boolean;
}

const QuestionContent = async ({
  questionId,
  isPending = false,
}: QuestionContentProps) => {
  const session = await getServerSession();
  const queryClient = getQueryClient();

  const result = await queryClient
    .fetchQuery(orpc.questions.get.queryOptions({ input: { questionId } }))
    .then((data) => ({ data, error: undefined }))
    .catch(() => ({ data: undefined, error: true }));

  if (!result.data) return notFound();

  const question = result.data;
  const { author, createdAt, answers, views, title, content, tags } = question;
  const isAuthor = session?.user?.id === author.id.toString();

  if (
    (question.status === "approved" && isPending) ||
    (question.status !== "approved" && (!isPending || !isAuthor))
  ) {
    return notFound();
  }

  if (!isPending) {
    after(async () => {
      await ViewService.incrementQuestionViews(questionId);
    });
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full justify-between">
          <div className="flex-start gap-1.5">
            <UserAvatar
              username={author.username}
              name={author.name}
              image={author.image ?? ""}
              className="size-7"
              fallbackClassName="text-xs"
            />

            <Link href={`/${author.username}`}>
              <p className="pg-semibold text-dark300_light700 text-lg">
                {author.name}
              </p>
            </Link>
          </div>

          {!isPending && (
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
          )}
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3 w-full">
          {title}
        </h2>
      </div>

      <div className="mt-4 mb-8 flex flex-wrap gap-4">
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

      <div className="flex-between mt-8">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagCard key={tag.id} id={tag.id} name={tag.name} compact />
          ))}
        </div>

        {isAuthor && (
          <EditDelete
            type="question"
            itemId={question.id}
            showDelete={!isPending}
          />
        )}
      </div>

      {!isPending && <Separator className="bg-light700_dark400 mt-10 h-1" />}
    </>
  );
};

export default QuestionContent;
