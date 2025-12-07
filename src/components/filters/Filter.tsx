"use client";

import { Route } from "next";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { formUrlQuery } from "@/lib/url";
import { ListFilter } from "lucide-react";

interface Filter {
  label: string;
  value: string;
}

interface FilterProps {
  filters: Filter[];
  className?: string;
  containerClassName?: string;
}

const Filter = ({ filters, className, containerClassName }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParams = searchParams.get("filter");

  const handleUpdateFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl as Route, { scroll: false });
  };

  return (
    <div className={cn("relative", containerClassName)}>
      <Select
        onValueChange={handleUpdateFilter}
        defaultValue=""
        value={filterParams ?? ""}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border! bg-light800_dark300 text-dark500_light700 border cursor-pointer",
            className,
          )}
          aria-label="Filter Options"
        >
          <div className="line-clamp-1 flex items-center gap-2 flex-1 text-left">
            <ListFilter />
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-light800_dark200">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="focus:bg-light900_dark300 focus:text-primary-500 hover:bg-light900_dark300 cursor-pointer"
                aria-label={item.label}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
