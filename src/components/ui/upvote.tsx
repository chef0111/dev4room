"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { TbArrowBigUp, TbArrowBigUpFilled } from "react-icons/tb";

interface VotesProps {
  disabled?: boolean;
  hasUpvoted?: boolean;
  onClick: (type: "upvote" | "downvote") => void;
}

const Upvote = ({
  disabled = false,
  hasUpvoted = false,
  onClick,
}: VotesProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick("upvote")}
      disabled={disabled}
      className="h-5 w-5 p-0 group bg-transparent! relative disabled:opacity-100 overflow-visible"
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
  );
};

export default Upvote;
