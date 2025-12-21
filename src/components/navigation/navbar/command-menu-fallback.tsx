"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

const CommandMenuFallback = () => {
  return (
    <Button
      variant="outline"
      className="bg-light800_darksecondgradient text-light400_light500 relative h-10 w-full max-w-80 cursor-default justify-start gap-2 rounded-lg border-none px-3 text-sm max-md:hidden lg:max-w-140"
      disabled
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Search...</span>
      <KbdGroup className="gap-0.5">
        <Kbd className="bg-light900_dark300 size-6 border text-xs">⌘</Kbd>
        <Kbd className="bg-light900_dark300 size-6 border text-xs">K</Kbd>
      </KbdGroup>
    </Button>
  );
};

export default CommandMenuFallback;
