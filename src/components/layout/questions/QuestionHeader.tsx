import Metric from "@/components/shared/Metric";
import UserAvatar from "@/components/layout/profile/UserAvatar";

import Link from "next/link";
import { getTimeStamp, formatNumber } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Votes from "@/components/shared/Votes";
import SaveQuestion from "./SaveQuestion";

interface QuestionHeaderProps {
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  createdAt: Date;
  answers: number;
  views: number;
  upvotes: number;
  downvotes: number;
  hasSaved?: Promise<{ saved: boolean }>;
}

const QuestionHeader = ({
  questionId,
  authorId,
  authorName,
  authorAvatar,
  title,
  createdAt,
  answers,
  views,
  upvotes,
  downvotes,
  hasSaved,
}: QuestionHeaderProps) => {
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full justify-between">
          <div className="flex-start gap-1">
            <UserAvatar
              id={authorId}
              name={authorName}
              image={authorAvatar}
              className="size-6"
              fallbackClassName="text-2.5"
            />

            <Link href={`/profile/${authorId}`}>
              <p className="pg-semibold text-dark300_light700">{authorName}</p>
            </Link>
          </div>

          <div className="flex-end gap-2">
            <Suspense
              fallback={
                <div className="flex gap-3.5">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
              }
            >
              <Votes
                targetType="question"
                targetId={questionId}
                upvotes={upvotes}
                downvotes={downvotes}
              />

              <SaveQuestion question={questionId} hasSaved={hasSaved!} />
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
    </>
  );
};

export default QuestionHeader;
