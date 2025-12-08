"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, Transition, motion } from "motion/react";
import {
  Children,
  cloneElement,
  ReactElement,
  useEffect,
  useState,
  useId,
} from "react";

export type AnimatedTabProps = {
  children:
    | ReactElement<{ "data-id": string }>[]
    | ReactElement<{ "data-id": string }>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedTab({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedTabProps) {
  const [internalActiveId, setInternalActiveId] = useState<string | null>(
    defaultValue ?? null,
  );
  const childRefs = useState(() => new Map<string, HTMLElement | null>())[0];
  const uniqueId = useId();

  // Use controlled value if provided, otherwise use internal state
  const activeId = value !== undefined ? value : internalActiveId;

  const handleSetActiveId = (id: string | null) => {
    if (value === undefined) {
      setInternalActiveId(id);
    }

    if (onValueChange) {
      onValueChange(id);
    }
  };

  useEffect(() => {
    const updateFromActiveAttribute = () => {
      for (const [id, el] of childRefs.entries()) {
        if (el && el.getAttribute("data-state") === "active") {
          if (activeId !== id) setInternalActiveId(id);
          return;
        }
      }
    };

    const observers: MutationObserver[] = [];
    for (const [, el] of childRefs.entries()) {
      if (!el) continue;
      const obs = new MutationObserver(updateFromActiveAttribute);
      obs.observe(el, { attributes: true, attributeFilter: ["data-state"] });
      observers.push(obs);
    }

    window.addEventListener("resize", updateFromActiveAttribute);
    window.addEventListener("scroll", updateFromActiveAttribute, true);

    updateFromActiveAttribute();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("resize", updateFromActiveAttribute);
      window.removeEventListener("scroll", updateFromActiveAttribute, true);
    };
  }, [childRefs, activeId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Children.map(children, (child: any, index) => {
    const id = child.props["data-id"];

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {
          onClick: () => handleSetActiveId(id),
        };

    return cloneElement(
      child,
      {
        key: index,
        className: cn("relative inline-flex", child.props.className),
        "data-checked": activeId === id ? "true" : "false",
        ref: (el: HTMLElement | null) => {
          childRefs.set(id, el);
        },
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <div className="z-10">{child.props.children}</div>
      </>,
    );
  });
}
