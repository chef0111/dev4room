"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui";
import { TbArrowBigDown, TbArrowBigDownFilled } from "react-icons/tb";
import { cn } from "@/lib/utils";

interface VotesProps {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: { button: "size-4", icon: "size-4", jump: -6 },
  md: { button: "size-5", icon: "size-5", jump: -8 },
  lg: { button: "size-6", icon: "size-6", jump: -10 },
};

const Downvote = ({
  isActive = false,
  disabled = false,
  onClick,
  size = "md",
  className,
}: VotesProps) => {
  const config = sizeConfig[size];
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        config.button,
        "p-0 group bg-transparent! relative disabled:opacity-100 overflow-visible",
        className,
      )}
      aria-label={isActive ? "Remove downvote" : "Downvote"}
      aria-pressed={isActive}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
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
            <TbArrowBigDownFilled
              className={cn("text-destructive", config.icon)}
            />
          </motion.span>
        ) : (
          <motion.span
            key="not-downvoted"
            className="flex-center"
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.9, y: -1 }}
          >
            <TbArrowBigDown
              className={cn(
                "text-light-400 dark:text-light-500 group-hover:text-destructive! transition-colors duration-200",
                config.icon,
              )}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};

export { Downvote };
