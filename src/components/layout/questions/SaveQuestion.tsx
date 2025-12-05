"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";

interface SaveQuestionProps {
  question: string;
  hasSaved: Promise<{ saved: boolean }>;
}

const SaveQuestion = ({ question, hasSaved }: SaveQuestionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveQuestion = async () => {};

  return (
    <Button
      variant="ghost"
      className={`size-7.5 hover:bg-orange-500/20! ${isLoading && "opacity-50"} cursor-pointer group`}
      aria-label="Save Question"
      disabled={isLoading}
      onClick={handleSaveQuestion}
    >
      {!!hasSaved ? (
        <TbBookmarkFilled className="text-orange-400 size-5" />
      ) : (
        <TbBookmark className="text-light-400 dark:text-light-500 group-hover:text-orange-400! size-5" />
      )}
    </Button>
  );
};

export default SaveQuestion;
