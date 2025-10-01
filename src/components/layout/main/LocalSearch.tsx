"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

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

  const form = useForm<SearchFormData>({
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "bg-light800_darkgradient! flex items-center min-h-12 grow gap-2 rounded-lg px-4 transition-all duration-200",
          className
        )}
      >
        {/* Search Icon */}
        <Search
          className="text-light400_light500 w-6 h-6 cursor-pointer"
          onClick={handleSearchSubmit}
        />

        {/* Search Input using FormField */}
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="text"
                  placeholder={placeholder}
                  className="pg-regular no-focus placeholder placeholder:pg-regular border-none bg-transparent! shadow-none outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default LocalSearch;
