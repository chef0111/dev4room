"use client";

import { ReactNode } from "react";
import { useFilterTransition } from "@/context/filter-provider";
import ContentFallback from "./ContentFallback";

interface FilterContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingMessage?: string;
  className?: string;
}

const FilterContent = ({
  children,
  fallback,
  loadingMessage = "Loading content...",
  className,
}: FilterContentProps) => {
  const { isPending } = useFilterTransition();

  if (isPending) {
    return <>{fallback || <ContentFallback message={loadingMessage} />}</>;
  }

  return <div className={className}>{children}</div>;
};

export default FilterContent;
