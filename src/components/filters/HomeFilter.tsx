"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { HomePageFilters } from "@/common/constants/filters";

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");

  const handleClick = (filter: string) => {
    let newUrl = "";

    // If filter is provided, set it as active and update the URL
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
  };

  return (
    <div className="mt-6 hidden sm:flex flex-wrap gap-3">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.label}
          onClick={() => handleClick(filter.value)}
          className={cn(
            "base-filter-btn no-focus",
            active === filter.value
              ? "bg-primary100_primary800 hover:bg-primary200_primary700 text-primary-500"
              : "bg-light800_dark300 text-light-500 hover:bg-light700_dark400!",
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
