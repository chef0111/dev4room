"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface BookmarkProps {
  isActive?: boolean;
  isLoading?: boolean;
  onToggle?: () => void;
  size?: "sm" | "md" | "lg";
  particleCount?: number;
  className?: string;
}

const sizeConfig = {
  sm: { button: "size-6", icon: "size-4", distance: 14, particleSize: 2 },
  md: { button: "size-8", icon: "size-6", distance: 20, particleSize: 3 },
  lg: { button: "size-10", icon: "size-8", distance: 26, particleSize: 4 },
};

const generateParticles = (count: number, baseDistance: number) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const distance = baseDistance + Math.random() * (baseDistance * 0.75);
    return {
      id: i,
      angle,
      distance,
      size: baseDistance * 0.15 + Math.random() * (baseDistance * 0.15),
      delay: Math.random() * 0.1,
    };
  });
};

const Bookmark = ({
  isActive = false,
  isLoading = false,
  onToggle,
  size = "md",
  particleCount = 8,
  className,
}: BookmarkProps) => {
  const [showParticles, setShowParticles] = useState(false);
  const config = sizeConfig[size];
  const particles = generateParticles(particleCount, config.distance);

  const handleClick = useCallback(() => {
    if (!isActive) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 500);
    }
    onToggle?.();
  }, [isActive, onToggle]);

  const bookmarkToggle = useDebounce(handleClick, 300);

  return (
    <div className={cn("relative", className)}>
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
        className={cn(
          config.button,
          "hover:bg-orange-500/20! disabled:opacity-100 group",
        )}
        aria-label={isActive ? "Remove from saved" : "Save"}
        aria-pressed={isActive}
        disabled={isLoading}
        onClick={bookmarkToggle}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isActive ? (
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
              <TbBookmarkFilled
                className={cn("text-orange-400", config.icon)}
              />
            </motion.span>
          ) : (
            <motion.span
              key="not-saved"
              className="flex-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <TbBookmark
                className={cn(
                  "text-light-400 dark:text-light-500 group-hover:text-orange-400!",
                  config.icon,
                )}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
};

export { Bookmark };
