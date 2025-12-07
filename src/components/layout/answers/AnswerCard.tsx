import Link from "next/link";
import { cn, getTimeStamp } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/layout/profile/UserAvatar";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import EditDelete from "@/components/shared/EditDelete";
import Votes from "@/components/shared/Votes";

interface AnswerCardProps {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  question: {
    id: string;
    title: string;
  };
  className?: string;
  showReadMore?: boolean;
  actionButtons?: boolean;
}

const AnswerCard = ({
  id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  className,
  showReadMore = false,
  actionButtons = false,
}: AnswerCardProps) => {
  return (
    <Card
      className={cn(
        "bg-light900_dark300 shadow-light-100! relative light-border border-b p-6 sm:px-10 mb-6 gap-0",
        className,
      )}
    >
      <span id={`answer-${id}`} className="hash-span" />

      <div className="mb-6 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author.id}
            name={author.name}
            image={author.image ?? undefined}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={`/profile/${author.id}`}
            className="flex flex-col sm:flex-wrap md:flex-row w-full sm:items-start max-sm:ml-1"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
              <span className="max-md:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-3.5">
            <Votes
              targetType="answer"
              targetId={id}
              upvotes={upvotes}
              downvotes={downvotes}
            />

            {actionButtons && <EditDelete type="answer" itemId={id} />}
          </div>
        </div>
      </div>

      <MarkdownPreview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question.id}#answer-${id}`}
          className="pg-semibold relative z-10 w-fit font-esbuild text-link-100 hover:text-primary-500 transition-all duration-200"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </Card>
  );
};

export default AnswerCard;
