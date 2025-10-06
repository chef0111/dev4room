"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Search Input using FormField */}
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <InputGroup
                  className={cn(
                    "bg-light800_darkgradient! flex items-center min-h-12 gap-2 border-none ring-0! grow rounded-lg px-2 transition-all duration-200",
                    className
                  )}
                >
                  <InputGroupInput
                    type="text"
                    placeholder={placeholder}
                    {...field}
                  />
                  <InputGroupAddon>
                    <Search
                      className="text-light400_light500 size-6! cursor-pointer"
                      onClick={handleSearchSubmit}
                    />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default LocalSearch;
