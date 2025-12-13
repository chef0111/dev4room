"use client";

import { useOptimistic } from "react";
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
import { useFilterTransition } from "@/context/filter-provider";

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
  const filterParams = searchParams.get("filter") ?? "";
  const [filterValue, setFilterValue] = useOptimistic(filterParams);
  const { startTransition } = useFilterTransition();

  const handleUpdateFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    startTransition(() => {
      setFilterValue(value);
      router.push(newUrl as Route, { scroll: false });
    });
  };

  return (
    <div className={cn("relative", containerClassName)}>
      <Select
        onValueChange={handleUpdateFilter}
        defaultValue=""
        value={filterValue}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border! bg-light800_dark300 text-dark500_light700 cursor-pointer border",
            className
          )}
          aria-label="Filter Options"
        >
          <div className="line-clamp-1 flex flex-1 items-center gap-2 text-left">
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
