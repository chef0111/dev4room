import { useMemo } from "react";
import Link from "next/link";

import routes from "@/common/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import TagCard from "../tags/TagCard";
import Metric from "@/components/shared/Metric";
import { Card } from "@/components/ui/card";
import EditDelete from "@/components/shared/EditDelete";

interface QuestionCardProps {
  question: Question;
  actionButtons?: boolean;
}

const QuestionCard = ({
  question: { id, title, tags, author, createdAt, upvotes, answers, views },
  actionButtons = false,
}: QuestionCardProps) => {
  const renderTags = useMemo(
    () =>
      tags.map((tag: Tag) => (
        <TagCard key={tag.id} id={tag.id} name={tag.name} compact />
      )),
    [tags]
  );

  return (
    <Card className="card-wrapper border-none rounded-lg p-6 sm:px-10 gap-0">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={routes.question(id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {actionButtons && <EditDelete type="question" itemId={id} />}
      </div>

      <div className="my-3 flex flex-wrap w-full gap-2">{renderTags}</div>

      <div className="flex-between flex-wrap mt-6 w-full gap-3">
        <Metric
          href={routes.profile(author.id)}
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          titleStyles="max-sm:hidden"
        />

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
