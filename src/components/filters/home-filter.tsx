"use client";

import { useOptimistic } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HomePageFilters } from "@/common/constants/filters";
import { useFilterTransition } from "@/context/filter-provider";

const HomeFilter = () => {
  const { startTransition } = useFilterTransition();

  const [{ filter }, setParams] = useQueryStates(
    {
      filter: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
      scroll: false,
      throttleMs: 100,
    }
  );

  const [filterValue, setFilterValue] = useOptimistic(filter);

  const handleClick = (filterValue: string) => {
    const nextValue = filter === filterValue ? "" : filterValue.toLowerCase();

    startTransition(() => {
      setFilterValue(nextValue);
      if (filter === filterValue) {
        setParams({ filter: null, page: 1 });
      } else {
        setParams({ filter: filterValue.toLowerCase(), page: 1 });
      }
    });
  };

  return (
    <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.label}
          onClick={() => handleClick(item.value)}
          className={cn(
            "base-filter-btn no-focus",
            filterValue === item.value
              ? "bg-primary100_primary800 hover:bg-primary200_primary700 text-primary-500"
              : "bg-light800_dark300 text-light-500 hover:bg-light700_dark400!"
          )}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
