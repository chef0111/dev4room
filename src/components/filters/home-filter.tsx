"use client";

import { Route } from "next";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { HomePageFilters } from "@/common/constants/filters";
import { useOptimistic } from "react";
import { useFilterTransition } from "@/context/filter-provider";

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter") ?? "";
  const [filterValue, setFilterValue] = useOptimistic(filterParams);
  const { startTransition } = useFilterTransition();

  const handleClick = (filter: string) => {
    let newUrl = "";

    // If filter is provided, set it as active and update the URL
    if (filter === filterParams) {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }

    startTransition(() => {
      setFilterValue(filter === filterValue ? "" : filter);
      router.push(newUrl as Route, { scroll: false });
    });
  };

  return (
    <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.label}
          onClick={() => handleClick(filter.value)}
          className={cn(
            "base-filter-btn no-focus",
            filterValue === filter.value
              ? "bg-primary100_primary800 hover:bg-primary200_primary700 text-primary-500"
              : "bg-light800_dark300 text-light-500 hover:bg-light700_dark400!"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
