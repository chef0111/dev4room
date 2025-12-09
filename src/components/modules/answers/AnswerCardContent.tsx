"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { Route } from "next";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface AnswerCardContentProps {
  previewContent: ReactNode;
  fullContent: ReactNode;
  toggleExpand?: boolean;
  expandable?: boolean;
  questionId?: string;
  answerId?: string;
}

const AnswerCardContent = ({
  previewContent,
  fullContent,
  toggleExpand,
  expandable = true,
  questionId,
  answerId,
}: AnswerCardContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showBlur = toggleExpand && !isExpanded && expandable;

  const answerUrl =
    `/questions/${questionId}?answerId=${answerId}#answer-${answerId}` as Route;

  return (
    <div className="relative">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          !isExpanded && toggleExpand,
        )}
        style={
          showBlur
            ? {
                maskImage:
                  "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
              }
            : undefined
        }
      >
        {isExpanded ? fullContent : previewContent}
      </div>

      {toggleExpand &&
        (expandable ? (
          <Button
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full relative z-10 hover:no-underline mt-1 flex items-center gap-1 p-0 h-auto text-sm font-medium text-primary-500 hover:text-primary-500/80 transition-colors duration-200"
          >
            <span>{isExpanded ? "Show less" : "Show more..."}</span>
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </Button>
        ) : (
          <Link
            href={answerUrl}
            className="relative z-10 mt-1 flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-500/80 transition-colors duration-200"
          >
            <span>Read more...</span>
          </Link>
        ))}
    </div>
  );
};

export default AnswerCardContent;
