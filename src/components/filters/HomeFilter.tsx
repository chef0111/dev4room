"use client";

import { useState, useCallback, memo, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/common/constants/filters";

const BASE_BUTTON_CLASSES =
  "body-medium rounded-md px-6 py-3 capitalize shadow-none transition-all duration-200";

const HomeFilter = memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");

  const getButtonClassName = useCallback(
    (isActive: boolean) =>
      cn(
        BASE_BUTTON_CLASSES,
        isActive
          ? "bg-primary100_primary800 hover:bg-primary200_primary700 text-primary-500 cursor-pointer"
          : "bg-light800_dark300 text-light-500 hover:bg-light700_dark400! cursor-pointer"
      ),
    []
  );

  const handleClick = useCallback(
    (filter: string) => {
      let newUrl = "";

      if (filter === active) {
        setActive("");
        newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["filter"],
        });
      } else {
        setActive(filter);
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "filter",
          value: filter.toLowerCase(),
        });
      }
      router.push(newUrl, { scroll: false });
    },
    [active, searchParams, router]
  );

  const filterButtons = useMemo(
    () =>
      HomePageFilters.map((filter) => (
        <Button
          key={filter.label}
          onClick={() => handleClick(filter.value)}
          className={getButtonClassName(active === filter.value)}
        >
          {filter.label}
        </Button>
      )),
    [active, handleClick, getButtonClassName]
  );

  return (
    <div className="mt-6 hidden sm:flex flex-wrap gap-3">{filterButtons}</div>
  );
});

HomeFilter.displayName = "HomeFilter";

export default HomeFilter;
