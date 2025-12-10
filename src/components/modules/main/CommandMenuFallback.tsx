"use client";

import { Search } from "lucide-react";
import { Button, Kbd, KbdGroup } from "@/components/ui";

const CommandMenuFallback = () => {
  return (
    <Button
      variant="outline"
      className="bg-light800_darksecondgradient border-none text-light400_light500 relative h-10 w-full max-w-80 lg:max-w-140 justify-start gap-2 rounded-lg px-3 text-sm max-md:hidden cursor-default"
      disabled
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Search...</span>
      <KbdGroup className="gap-0.5">
        <Kbd className="bg-light900_dark300 border size-6 text-xs">⌘</Kbd>
        <Kbd className="bg-light900_dark300 border size-6 text-xs">K</Kbd>
      </KbdGroup>
    </Button>
  );
};

export default CommandMenuFallback;
