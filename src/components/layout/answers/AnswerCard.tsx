"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";

import { cn, getTimeStamp } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/layout/profile/UserAvatar";
import EditorFallback from "@/components/markdown/EditorFallback";
import EditDelete from "@/components/shared/EditDelete";
import Votes from "@/components/shared/Votes";
import AnswerForm from "./AnswerForm";
import AnswerCardContent from "./AnswerCardContent";

interface Author {
  id: string;
  name: string;
  image: string | null;
}

interface AnswerCardClientProps {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  questionId: string;
  isAuthor?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  expandable?: boolean;
  defaultExpanded?: boolean;
  className?: string;
  previewMarkdown: ReactNode;
  fullMarkdown: ReactNode;
  shouldShowToggle?: boolean;
}

const AnswerCard = ({
  id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  questionId,
  isAuthor = false,
  showEdit = false,
  showDelete = false,
  expandable = true,
  defaultExpanded = false,
  className,
  previewMarkdown,
  fullMarkdown,
  shouldShowToggle,
}: AnswerCardClientProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      className={cn(
        "bg-light900_dark300 shadow-light-100! relative light-border border-b p-6 sm:px-10 mb-6 gap-0",
        className,
      )}
    >
      <span id={`answer-${id}`} className="hash-span" />

      <div className="mb-4 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
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

            {isAuthor && (showEdit || showDelete) && !isEditing && (
              <EditDelete
                type="answer"
                itemId={id}
                onEdit={() => setIsEditing(true)}
                showEdit={showEdit}
                showDelete={showDelete}
              />
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <Suspense fallback={<EditorFallback />}>
          <AnswerForm
            questionId={questionId}
            answer={{ id, content }}
            isEdit
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
            compact
          />
        </Suspense>
      ) : (
        <AnswerCardContent
          previewContent={previewMarkdown}
          fullContent={fullMarkdown}
          shouldShowToggle={shouldShowToggle}
          defaultExpanded={defaultExpanded}
          expandable={expandable}
          questionId={questionId}
          answerId={id}
        />
      )}
    </Card>
  );
};

export default AnswerCard;
