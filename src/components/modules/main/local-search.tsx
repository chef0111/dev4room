"use client";

import { cn } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { Field } from "@/components/ui/field";
import SearchInput from "./search-input";
import { useFilterTransition } from "@/context/filter-provider";

interface LocalSearchProps {
  placeholder: string;
  className?: string;
}

interface SearchFormData {
  query: string;
}

const LocalSearch = ({ placeholder, className }: LocalSearchProps) => {
  const { startTransition } = useFilterTransition();
  const [{ query }, setParams] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
      scroll: false,
      throttleMs: 300,
    }
  );

  const form = useForm<{ query: string }>({
    defaultValues: { query },
  });

  const handleSubmit = (data: SearchFormData) => {
    const searchQuery = data.query.trim();
    startTransition(() => {
      setParams({
        query: searchQuery || null,
        page: 1,
      });
    });
  };

  const handleSearchSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("w-full", className)}
    >
      <Controller
        name="query"
        control={form.control}
        render={({ field }) => (
          <Field>
            <SearchInput
              field={field}
              placeholder={placeholder}
              className="bg-light800_darksecondgradient! min-h-12 min-w-full gap-2 px-2"
              onClick={handleSearchSubmit}
            />
          </Field>
        )}
      />
    </form>
  );
};

export default LocalSearch;
