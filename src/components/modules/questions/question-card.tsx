import { ReactNode, useMemo } from "react";
import { type Route } from "next";
import Link from "next/link";

import { getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/modules/tags/tag-card";
import { Metric } from "@/components/shared";
import { Card } from "@/components/ui/card";
import EditDelete from "@/components/shared/edit-delete";
import UserAvatar from "../profile/user-avatar";

interface QuestionCardProps {
  question: Question;
  href?: string | null;
  isPending?: boolean;
  actionButtons?: boolean;
  customActions?: ReactNode;
}

const QuestionCard = ({
  question: { id, title, tags, author, createdAt, upvotes, answers, views },
  href = `/questions/${id}`,
  actionButtons = false,
  customActions,
}: QuestionCardProps) => {
  const renderTags = useMemo(
    () =>
      tags.map((tag: Tag) => (
        <TagCard key={tag.id} id={tag.id} name={tag.name} compact />
      )),
    [tags]
  );

  return (
    <Card className="card-wrapper gap-0 rounded-lg border-none p-6 sm:px-10">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={href as Route}>
            <h2 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h2>
          </Link>
        </div>

        {customActions
          ? customActions
          : actionButtons && <EditDelete type="question" itemId={id} />}
      </div>

      <div className="my-3 flex w-full flex-wrap gap-2">{renderTags}</div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <div className="flex-center gap-1">
          <UserAvatar
            username={author.username}
            name={author.name}
            image={author.image ?? ""}
            className="size-6"
            fallbackClassName="text-[10px]"
          />

          <Link href={`/profile/${author.username}`}>
            <p className="small-regular text-dark300_light700">
              <span className="body-medium">{author.name}</span> • asked{" "}
              {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="Like"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="message"
            value={answers}
            title={answers === 1 ? " Answer" : " Answers"}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="eye"
            value={views}
            title={views === 1 ? " View" : " Views"}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
