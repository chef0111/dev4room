"use client";

import { Bookmark } from "@/components/ui/dev";
import { useBookmark } from "@/queries/bookmark.queries";

interface SaveQuestionProps {
  questionId: string;
}

const SaveQuestion = ({ questionId }: SaveQuestionProps) => {
  const { isSaved, toggleBookmark, isLoading } = useBookmark({ questionId });

  return (
    <Bookmark
      isActive={isSaved}
      isLoading={isLoading}
      onToggle={toggleBookmark}
    />
  );
};

export default SaveQuestion;
