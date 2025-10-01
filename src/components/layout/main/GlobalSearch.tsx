"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, Search } from "lucide-react";

interface GlobalSearchProps {
  route: string;
  placeholder: string;
  className?: string;
}

const GlobalSearch = ({ route, placeholder, className }: GlobalSearchProps) => {
  console.log(route);
  return (
    <div
      className={cn(
        "bg-light800_darksecondgradient flex items-center min-h-10 max-w-120 max-lg:hidden rounded-lg px-4 transition-all duration-200",
        className
      )}
    >
      {/* Search Icon and Input */}
      <Search className="text-light400_light500 w-5 h-5 cursor-pointer" />
      <Input
        type="text"
        placeholder={placeholder}
        className="body-regular no-focus placeholder placeholder:body-regular border-none bg-transparent! shadow-none outline-none"
      />
      <div className="flex-between pointer-events-none gap-1 no-copy">
        <Button
          variant="outline"
          type="button"
          className="w-9 h-6.5 no-focus flex-center text-center rounded-sm gap-px"
          aria-label="Shortcut key ⌘/Ctrl + K"
        >
          <Command className="size-3 text-light400_light500" />
          <span className="text-sm text-light400_light500 leading-tight">
            K
          </span>
        </Button>
      </div>
    </div>
  );
};

export default GlobalSearch;
