"use client";

import { motion, MotionConfig } from "motion/react";
import { useVote, type TargetType } from "@/queries/vote";
import NumberFlow, { useCanAnimate } from "@number-flow/react";
import { Upvote } from "@/components/ui/dev";
import { Downvote } from "@/components/ui/dev";

const MotionNumberFlow = motion.create(NumberFlow);

interface VotesProps {
  targetType: TargetType;
  targetId: string;
  upvotes: number;
  downvotes: number;
}

const Votes = ({
  targetType,
  targetId,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
}: VotesProps) => {
  const canAnimate = useCanAnimate({ respectMotionPreference: true });
  const { state, vote, isVoting } = useVote({
    targetType,
    targetId,
    initialUpvotes,
    initialDownvotes,
  });

  const { upvotes, hasUpvoted, hasDownvoted } = state;

  return (
    <div className="flex-center gap-2">
      <MotionConfig
        transition={{
          layout: canAnimate
            ? { duration: 0.2, bounce: 0, type: "spring" }
            : { duration: 0 },
        }}
      >
        <motion.div
          className="flex-center bg-light700_dark400 h-8 gap-1.5 rounded-md px-1.5"
          role="group"
          aria-label="Vote buttons"
          layout
        >
          <Upvote
            isActive={hasUpvoted}
            disabled={isVoting}
            onClick={() => vote("upvote")}
          />

          <MotionNumberFlow
            value={upvotes}
            format={{ notation: "compact" }}
            className="body-medium text-dark400_light900 pr-1"
            aria-label={`${upvotes} upvotes`}
            layout
            layoutRoot
          />
        </motion.div>
      </MotionConfig>

      <div className="flex-end bg-light700_dark400 h-8 rounded-md px-1.5">
        <Downvote
          isActive={hasDownvoted}
          disabled={isVoting}
          onClick={() => vote("downvote")}
        />
      </div>
    </div>
  );
};

export default Votes;
