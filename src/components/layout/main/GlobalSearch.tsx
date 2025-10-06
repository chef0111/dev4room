"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface GlobalSearchProps {
  route: string;
  placeholder: string;
  className?: string;
}

const GlobalSearch = ({ route, placeholder, className }: GlobalSearchProps) => {
  console.log(route);
  return (
    <InputGroup
      className={cn(
        "bg-light800_darksecondgradient! flex items-center min-h-10 max-w-120 gap-1 border-none ring-0! grow rounded-lg transition-all duration-200",
        className
      )}
    >
      <InputGroupInput type="text" placeholder={placeholder} />
      <InputGroupAddon>
        <Search className="text-light400_light500 size-6! cursor-pointer" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd className="bg-light900_dark300 border size-6.5 text-lg text-light400_light500">
            ⌘
          </Kbd>
          <span className="text-light400_light500">+</span>
          <Kbd className="bg-light900_dark300 border size-6.5 text-md text-light400_light500">
            K
          </Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default GlobalSearch;
