"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";

import { cn, getTimeStamp } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/modules/profile/user-avatar";
import EditorFallback from "@/components/markdown/editor-fallback";
import EditDelete from "@/components/shared/edit-delete";
import Votes from "@/components/modules/vote/votes";
import { AnswerCardContent } from "./";
import { AnswerForm } from "./";

interface Author {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

interface AnswerCardProps {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  questionId: string;
  showEdit?: boolean;
  showDelete?: boolean;
  expandable?: boolean;
  className?: string;
  previewMarkdown: ReactNode;
  fullMarkdown: ReactNode;
  toggleExpand?: boolean;
}

const AnswerCard = ({
  id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  questionId,
  showEdit = false,
  showDelete = false,
  expandable = true,
  className,
  previewMarkdown,
  fullMarkdown,
  toggleExpand,
}: AnswerCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      id={`answer-${id}`}
      className={cn(
        "bg-light900_dark300 shadow-light-100! light-border relative mb-6 gap-0 border-b p-6 sm:px-10",
        className
      )}
    >
      <div className="mb-4 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            username={author.username}
            name={author.name}
            image={author.image ?? undefined}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={`/${author.username}`}
            className="flex w-full flex-col max-sm:ml-1 sm:flex-wrap sm:items-start md:flex-row"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="small-regular text-light400_light500 mt-0.5 ml-0.5 line-clamp-1">
              <span className="max-md:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-2">
            <Votes
              targetType="answer"
              targetId={id}
              upvotes={upvotes}
              downvotes={downvotes}
            />

            {(showEdit || showDelete) && !isEditing && (
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
          toggleExpand={toggleExpand}
          expandable={expandable}
          questionId={questionId}
          answerId={id}
        />
      )}
    </Card>
  );
};

export default AnswerCard;
