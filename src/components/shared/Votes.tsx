"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbArrowBigUp,
  TbArrowBigUpFilled,
} from "react-icons/tb";

interface VotesProps {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
}

const Votes = ({ targetType, targetId, upvotes, downvotes }: VotesProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const success = false;
  const hasUpvoted = false;
  const hasDownvoted = false;

  const handleVote = async (type: "upvote" | "downvote") => {
    console.log(type);
  };

  return (
    <div className="flex-center gap-2">
      <div
        className="flex-center bg-light700_dark400 min-w-6 rounded-md gap-1 p-1.5"
        role="status"
      >
        <Button
          variant="ghost"
          disabled={isLoading}
          onClick={() => !isLoading && handleVote("upvote")}
          className="h-5 w-5 group bg-transparent!"
          aria-label="Upvote"
        >
          {success && hasUpvoted ? (
            <TbArrowBigUpFilled className="size-5 text-green-500" />
          ) : (
            <TbArrowBigUp className="size-5 text-light-400 dark:text-light-500 group-hover:text-green-500!" />
          )}
        </Button>

        <p
          className="body-medium text-dark400_light900 pr-1.5"
          aria-label="Upvotes count"
        >
          {formatNumber(upvotes)}
        </p>
      </div>

      <div className="flex-center bg-light700_dark400 min-w-6 rounded-md p-1.5">
        <Button
          variant="ghost"
          disabled={isLoading}
          onClick={() => !isLoading && handleVote("downvote")}
          className="h-5 w-5 group bg-transparent!"
          aria-label="Downvote"
        >
          {success && hasDownvoted ? (
            <TbArrowBigDownFilled className="size-5 text-red-400" />
          ) : (
            <TbArrowBigDown className="size-5 text-light-400 dark:text-light-500 group-hover:text-red-400!" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Votes;
