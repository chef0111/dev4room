"use client";

import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { useVote, type TargetType } from "@/services/vote.service";
import { Button } from "@/components/ui/button";
import NumberFlow, { useCanAnimate } from "@number-flow/react";
import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbArrowBigUp,
  TbArrowBigUpFilled,
} from "react-icons/tb";

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
  const canAnimate = useCanAnimate();
  const { state, vote } = useVote({
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
          className="flex-center bg-light700_dark400 rounded-md h-8 gap-1.5 px-1.5"
          role="group"
          aria-label="Vote buttons"
          layout
        >
          <Button
            variant="ghost"
            onClick={() => vote("upvote")}
            className="h-5 w-5 p-0 group bg-transparent! relative overflow-visible"
            aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
            aria-pressed={hasUpvoted}
          >
            <AnimatePresence mode="wait" initial={false}>
              {hasUpvoted ? (
                <motion.span
                  key="upvoted"
                  className="flex-center"
                  initial={{ y: 0, scale: 0.8 }}
                  animate={{
                    y: [0, -8, 0],
                    scale: [0.8, 1.2, 1],
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{
                    duration: 0.4,
                    times: [0, 0.4, 1],
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <TbArrowBigUpFilled className="size-5 text-green-500" />
                </motion.span>
              ) : (
                <motion.span
                  key="not-upvoted"
                  className="flex-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9, y: 1 }}
                >
                  <TbArrowBigUp className="size-5 text-light-400 dark:text-light-500 group-hover:text-green-500!" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

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
        <Button
          variant="ghost"
          onClick={() => vote("downvote")}
          className="h-5 w-5 p-0 group bg-transparent! relative overflow-visible"
          aria-label={hasDownvoted ? "Remove downvote" : "Downvote"}
          aria-pressed={hasDownvoted}
        >
          <AnimatePresence mode="wait" initial={false}>
            {hasDownvoted ? (
              <motion.span
                key="downvoted"
                className="flex-center"
                initial={{ y: 0, scale: 0.8 }}
                animate={{
                  y: [0, 8, 0],
                  scale: [0.8, 1.2, 1],
                }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.4, 1],
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <TbArrowBigDownFilled className="size-5 text-red-400" />
              </motion.span>
            ) : (
              <motion.span
                key="not-downvoted"
                className="flex-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.15 }}
                whileHover={{ scale: 1.15, y: 2 }}
                whileTap={{ scale: 0.9, y: -1 }}
              >
                <TbArrowBigDown className="size-5 text-light-400 dark:text-light-500 group-hover:text-red-400!" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};

export default Votes;
