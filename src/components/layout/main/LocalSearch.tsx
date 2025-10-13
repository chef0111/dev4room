"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { Field } from "@/components/ui/field";
import SearchInput from "./SearchInput";

interface LocalSearchProps {
  route: string;
  placeholder: string;
  className?: string;
}

interface SearchFormData {
  query: string;
}

const LocalSearch = ({ route, placeholder, className }: LocalSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const pathname = usePathname();

  const form = useForm<{ query: string }>({
    defaultValues: { query },
  });

  const handleSubmit = (data: SearchFormData) => {
    const searchQuery = data.query.trim();

    if (searchQuery) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "query",
        value: searchQuery,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });

        router.push(newUrl, { scroll: false });
      }
    }
  };

  const handleSearchSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="query"
        control={form.control}
        render={({ field }) => (
          <Field className="flex-1">
            <SearchInput
              field={field}
              placeholder={placeholder}
              className={cn(
                "bg-light800_darkgradient! min-h-12 gap-2 px-2",
                className
              )}
              onClick={handleSearchSubmit}
            />
          </Field>
        )}
      />
    </form>
  );
};

export default LocalSearch;
