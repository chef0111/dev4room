"use client";

import { useEffect } from "react";

interface ScrollToAnswerProps {
  answerId?: string;
}

const ScrollToAnswer = ({ answerId }: ScrollToAnswerProps) => {
  useEffect(() => {
    if (!answerId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(`answer-${answerId}`);
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [answerId]);

  return null;
};

export default ScrollToAnswer;
