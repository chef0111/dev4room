"use client";

import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { KbdGroup, Kbd } from "@/components/ui/kbd";
import { Search } from "lucide-react";

interface SearchInputProps {
  field?: ControllerRenderProps<{ query: string }, "query">;
  className?: string;
  placeholder?: string;
  onClick?: () => void;
  global?: boolean;
}

const SearchInput = ({
  field,
  className,
  placeholder,
  onClick,
  global = false,
}: SearchInputProps) => {
  return (
    <InputGroup
      className={cn(
        "flex items-center border-none ring-0! grow rounded-lg transition-all duration-200",
        className
      )}
    >
      <InputGroupInput {...field} type="text" placeholder={placeholder} />
      <InputGroupAddon>
        <Search
          className="text-light400_light500 size-6! cursor-pointer"
          onClick={onClick}
        />
      </InputGroupAddon>

      {global && (
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
      )}
    </InputGroup>
  );
};

export default SearchInput;
