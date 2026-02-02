"use client";

import { ReactNode } from "react";
import { useFilterTransition } from "@/context/filter-provider";
import { cn } from "@/lib/utils";

interface FilterContentProps {
  children: ReactNode;
  className?: string;
}

const FilterContent = ({ children, className }: FilterContentProps) => {
  const { isPending } = useFilterTransition();

  return (
    <div
      className={cn(
        "transition-opacity",
        isPending && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FilterContent;
