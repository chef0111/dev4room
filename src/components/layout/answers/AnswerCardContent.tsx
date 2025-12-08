"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface AnswerCardContentProps {
  previewContent: ReactNode;
  fullContent: ReactNode;
  shouldShowToggle?: boolean;
  defaultExpanded?: boolean;
  expandable?: boolean;
  questionId?: string;
  answerId?: string;
}

const AnswerCardContent = ({
  previewContent,
  fullContent,
  shouldShowToggle,
  defaultExpanded = false,
  expandable = true,
  questionId,
  answerId,
}: AnswerCardContentProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          !isExpanded && shouldShowToggle && "max-h-[150px]",
        )}
      >
        {isExpanded ? fullContent : previewContent}
      </div>

      {shouldShowToggle &&
        (expandable ? (
          <Button
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative z-10 hover:no-underline mt-4 flex items-center gap-1 p-0 h-auto text-sm font-medium text-primary-500 hover:text-primary-500/80 transition-colors duration-200 cursor-pointer"
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
            href={`/questions/${questionId}#answer-${answerId}`}
            className="relative z-10 mt-4 flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-500/80 transition-colors duration-200"
          >
            <span>Read more...</span>
          </Link>
        ))}
    </>
  );
};

export default AnswerCardContent;
