"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useHotkeys } from "react-hotkeys-hook";
import { FileQuestion, MessageSquare, Tag, Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Brand, Button, Kbd, KbdGroup, Spinner } from "@/components/ui";
import UserAvatar from "@/components/modules/profile/UserAvatar";
import { orpc } from "@/lib/orpc";

// Hook to debounce a value
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

interface SearchResult {
  questions: Array<{
    id: string;
    title: string;
    authorName: string | null;
    similarity: number;
  }>;
  answers: Array<{
    id: string;
    content: string;
    questionId: string;
    questionTitle: string;
    similarity: number;
  }>;
  tags: Array<{
    id: string;
    name: string;
    questions: number;
    similarity: number;
  }>;
  users: Array<{
    id: string;
    name: string;
    username: string;
    image: string | null;
    similarity: number;
  }>;
}

const CommandMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      if (searchQuery.length < 2) return null;
      return orpc.search.call({ query: searchQuery, limit: 5 });
    },
  });

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchMutation.mutate(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Keyboard shortcut to open
  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href as Route);
    },
    [router],
  );

  const MIN_SIMILARITY = 0.3;

  const rawResults = searchMutation.data as SearchResult | null;

  // Filter results to only include items above similarity threshold
  const results = rawResults
    ? {
        questions: rawResults.questions.filter(
          (q) => q.similarity >= MIN_SIMILARITY,
        ),
        answers: rawResults.answers.filter(
          (a) => a.similarity >= MIN_SIMILARITY,
        ),
        tags: rawResults.tags.filter((t) => t.similarity >= MIN_SIMILARITY),
        users: rawResults.users.filter((u) => u.similarity >= MIN_SIMILARITY),
      }
    : null;

  const hasResults =
    results &&
    (results.questions.length > 0 ||
      results.answers.length > 0 ||
      results.tags.length > 0 ||
      results.users.length > 0);

  return (
    <>
      <Button
        variant="outline"
        className="bg-light800_darksecondgradient border-none text-light400_light500 relative h-10 w-full max-w-80 lg:max-w-140 justify-start gap-2 rounded-lg px-3 text-sm max-md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search...</span>
        <KbdGroup className="gap-0.5">
          <Kbd className="bg-light900_dark300 border size-6 text-xs">⌘</Kbd>
          <Kbd className="bg-light900_dark300 border size-6 text-xs">K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
        className="scale-120"
      >
        <CommandInput
          placeholder="Search questions, answers, tags, users..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="">
          {searchMutation.isPending && (
            <div className="flex items-center justify-center gap-2 py-6">
              <Spinner />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {!searchMutation.isPending && query.length < 2 && (
            <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
          )}

          {!searchMutation.isPending && query.length >= 2 && !hasResults && (
            <CommandEmpty>
              No results found for &ldquo;{query}&rdquo;
            </CommandEmpty>
          )}

          {hasResults && (
            <>
              {results.questions.length > 0 && (
                <CommandGroup heading="Questions">
                  {results.questions.map((question) => (
                    <CommandItem
                      key={question.id}
                      value={`question-${question.id}`}
                      className="smooth-hover py-2!"
                      onSelect={() => handleSelect(`/questions/${question.id}`)}
                    >
                      <FileQuestion className="text-primary-500" />
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate">{question.title}</span>
                        <span className="text-muted-foreground text-xs">
                          by {question.authorName ?? "Anonymous"}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.answers.length > 0 && (
                <CommandGroup heading="Answers">
                  {results.answers.map((answer) => (
                    <CommandItem
                      key={answer.id}
                      value={`answer-${answer.id}`}
                      className="smooth-hover py-2!"
                      onSelect={() =>
                        handleSelect(
                          `/questions/${answer.questionId}?answerId=${answer.id}#answer-${answer.id}`,
                        )
                      }
                    >
                      <MessageSquare className="text-accent-blue" />
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate">
                          {answer.content.slice(0, 60)}...
                        </span>
                        <span className="text-muted-foreground text-xs">
                          on: {answer.questionTitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.tags.length > 0 && (
                <CommandGroup heading="Tags">
                  {results.tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={`tag-${tag.id}`}
                      onSelect={() => handleSelect(`/tags/${tag.id}`)}
                      className="smooth-hover py-2!"
                    >
                      <Tag className="text-light-400" />
                      <span>{tag.name}</span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {tag.questions} questions
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.users.length > 0 && (
                <CommandGroup heading="Users">
                  {results.users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={`user-${user.id}`}
                      onSelect={() => handleSelect(`/profile/${user.id}`)}
                      className="smooth-hover py-2!"
                    >
                      <UserAvatar
                        id={user.id}
                        name={user.name}
                        image={user.image ?? undefined}
                        className="size-5"
                      />
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate">{user.name}</span>
                        <span className="text-muted-foreground text-xs">
                          @{user.username}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>

        <div className="border-t p-2">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <Brand href={null} size={16} showText={false} />
            <div className="flex items-center gap-2">
              <span>Press</span>
              <Kbd className="bg-light900_dark300 border px-1.5 py-0.5 text-xs">
                ESC
              </Kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
};

export default CommandMenu;
