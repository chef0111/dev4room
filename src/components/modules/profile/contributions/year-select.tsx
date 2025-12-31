"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { useOptimistic } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useFilterTransition } from "@/context/filter-provider";

interface Data {
  label: string;
  value: string;
}

interface YearProps {
  data: Data[];
  className?: string;
  containerClassName?: string;
}

const YearSelect = ({ data, className, containerClassName }: YearProps) => {
  const { isPending, startTransition } = useFilterTransition();

  const [{ year }, setParams] = useQueryStates(
    {
      year: parseAsString.withDefault(data[0].value),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
      scroll: false,
      throttleMs: 100,
    }
  );

  const [yearValue, setYearValue] = useOptimistic(year);

  const handleUpdateFilter = (value: string) => {
    startTransition(() => {
      setYearValue(value);
      setParams({
        year: value || null,
        page: 1,
      });
    });
  };

  return (
    <div className={cn("relative", containerClassName)}>
      <Select
        onValueChange={handleUpdateFilter}
        defaultValue={data[0].value}
        value={yearValue}
        disabled={isPending}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border! bg-light800_dark300 text-dark500_light700 cursor-pointer border",
            className
          )}
          aria-label="Filter Options"
        >
          <div className="line-clamp-1 flex flex-1 items-center gap-2 text-left">
            <Calendar />
            <SelectValue placeholder="Select a year" />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-light800_dark200 min-w-24">
          <SelectGroup>
            {data.map((item) => (
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

export default YearSelect;
