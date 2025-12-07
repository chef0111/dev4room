"use client";

import { Bookmark } from "@/components/ui/dev";
import { useBookmark } from "@/services/bookmark.service";

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
