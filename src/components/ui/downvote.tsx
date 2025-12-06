import { motion, AnimatePresence } from "motion/react";
import { Button } from "./button";
import { TbArrowBigDown, TbArrowBigDownFilled } from "react-icons/tb";

interface VotesProps {
  disabled?: boolean;
  hasDownvoted?: boolean;
  onClick: (type: "upvote" | "downvote") => void;
}

const Downvote = ({
  disabled = false,
  hasDownvoted = false,
  onClick,
}: VotesProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick("downvote")}
      disabled={disabled}
      className="h-5 w-5 p-0 group bg-transparent! relative disabled:opacity-100 overflow-visible"
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
  );
};

export default Downvote;
