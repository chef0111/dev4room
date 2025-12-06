"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useBookmark } from "@/services/bookmark.service";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";

interface SaveQuestionProps {
  questionId: string;
}

const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const distance = 20 + Math.random() * 15;
    return {
      id: i,
      angle,
      distance,
      size: 3 + Math.random() * 3,
      delay: Math.random() * 0.1,
    };
  });
};

const particles = generateParticles(8);

const SaveQuestion = ({ questionId }: SaveQuestionProps) => {
  const { isSaved, toggleBookmark, isLoading } = useBookmark({ questionId });
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    if (!isSaved) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
    }
    toggleBookmark();
  };

  return (
    <div className="relative">
      {/* Particles burst effect */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none flex-center">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-orange-400"
                style={{
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{
                  scale: [0, 1, 0.5],
                  x:
                    Math.cos((particle.angle * Math.PI) / 180) *
                    particle.distance,
                  y:
                    Math.sin((particle.angle * Math.PI) / 180) *
                    particle.distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: particle.delay,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        className="size-8 hover:bg-orange-500/20! disabled:opacity-100 group"
        aria-label={isSaved ? "Remove from saved" : "Save Question"}
        aria-pressed={isSaved}
        disabled={isLoading}
        onClick={handleClick}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSaved ? (
            <motion.span
              key="saved"
              className="flex-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                times: [0, 0.4, 1],
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <TbBookmarkFilled className="text-orange-400 size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="not-saved"
              className="flex-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <TbBookmark className="text-light-400 dark:text-light-500 group-hover:text-orange-400! size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
};

export default SaveQuestion;
