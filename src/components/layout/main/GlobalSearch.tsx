"use client";

import { cn } from "@/lib/utils";
import SearchInput from "./SearchInput";

interface GlobalSearchProps {
  route: string;
  placeholder: string;
  className?: string;
}

const GlobalSearch = ({ route, placeholder, className }: GlobalSearchProps) => {
  console.log(route);
  return (
    <SearchInput
      global
      placeholder={placeholder}
      className={cn(
        "bg-light800_darksecondgradient! min-h-10 max-w-120 gap-1",
        className,
      )}
    />
  );
};

export default GlobalSearch;
