"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useHotkeys } from "react-hotkeys-hook";
import {
  FileQuestion,
  Flame,
  MessageSquare,
  Tag,
  Search,
  WifiOff,
} from "lucide-react";
import { orpc } from "@/lib/orpc";
import { isNetworkError } from "@/errors/error-utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button, Kbd, KbdGroup, Spinner } from "@/components/ui";
import { Brand } from "@/components/ui/dev";
import UserAvatar from "@/components/modules/profile/UserAvatar";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { useTopQuestions, usePopularTags } from "@/queries/recommend.queries";

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

type SearchState = {
  data: SearchResult | null;
  error: unknown;
  isLoading: boolean;
};

type SearchAction =
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; payload: SearchResult }
  | { type: "SEARCH_ERROR"; payload: unknown }
  | { type: "SEARCH_CLEAR" };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SEARCH_START":
      return { data: null, error: null, isLoading: true };
    case "SEARCH_SUCCESS":
      return { data: action.payload, error: null, isLoading: false };
    case "SEARCH_ERROR":
      return { data: null, error: action.payload, isLoading: false };
    case "SEARCH_CLEAR":
      return { data: null, error: null, isLoading: false };
    default:
      return state;
  }
}

const CommandMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [searchState, dispatch] = useReducer(searchReducer, {
    data: null,
    error: null,
    isLoading: false,
  });

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearching,
  } = searchState;

  // Fetch top questions and popular tags when menu is open and no query
  const showSuggestions = open && query.length === 0 && !isSearching;
  const { data: topQuestionsData, isLoading: isLoadingTopQuestions } =
    useTopQuestions(showSuggestions);
  const { data: popularTagsData, isLoading: isLoadingPopularTags } =
    usePopularTags(showSuggestions);

  // Check network error
  const hasNetworkError = searchError !== null && isNetworkError(searchError);

  // Immediately clear results when query not valid
  useEffect(() => {
    if (query.length < 2) {
      dispatch({ type: "SEARCH_CLEAR" });
    }
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      dispatch({ type: "SEARCH_START" });

      orpc.search
        .call({ query: debouncedQuery, limit: 5 })
        .then((result) => {
          dispatch({ type: "SEARCH_SUCCESS", payload: result });
        })
        .catch((error) => {
          dispatch({ type: "SEARCH_ERROR", payload: error });
        });
    } else if (debouncedQuery.length > 0 && debouncedQuery.length < 2) {
      dispatch({ type: "SEARCH_CLEAR" });
    }
  }, [debouncedQuery]);

  // Keyboard shortcut to open
  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true }
  );

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href as Route);
    },
    [router]
  );

  const handleRetry = useCallback(() => {
    if (debouncedQuery.length >= 2) {
      dispatch({ type: "SEARCH_START" });

      orpc.search
        .call({ query: debouncedQuery, limit: 5 })
        .then((result) => {
          dispatch({ type: "SEARCH_SUCCESS", payload: result });
        })
        .catch((error) => {
          dispatch({ type: "SEARCH_ERROR", payload: error });
        });
    }
  }, [debouncedQuery]);

  const MIN_SIMILARITY = 0.35;

  const rawResults = searchData;

  // Filter results to only include items above similarity threshold
  const results = rawResults
    ? {
        questions: rawResults.questions.filter(
          (q) => q.similarity >= MIN_SIMILARITY
        ),
        answers: rawResults.answers.filter(
          (a) => a.similarity >= MIN_SIMILARITY
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
        className="bg-light800_darksecondgradient text-light400_light500 relative h-10 w-full max-w-80 justify-start gap-2 rounded-lg border-none px-3 text-sm max-md:hidden lg:max-w-140"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search...</span>
        <KbdGroup className="gap-0.5">
          <Kbd className="bg-light900_dark300 size-6 border text-xs">⌘</Kbd>
          <Kbd className="bg-light900_dark300 size-6 border text-xs">K</Kbd>
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
          {isSearching && (
            <div className="flex items-center justify-center gap-2 py-6">
              <Spinner />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {/* Network Error State */}
          {hasNetworkError && (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <WifiOff className="text-destructive size-8" />
              <div className="text-center">
                <p className="text-sm font-medium">Network Error</p>
                <p className="text-muted-foreground text-xs">
                  Please check your connection
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          )}

          {/* Default state: Top Questions & Popular Tags */}
          {!isSearching && !hasNetworkError && query.length < 2 && (
            <>
              {(isLoadingTopQuestions || isLoadingPopularTags) && (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Spinner />
                  <span className="text-sm">Loading suggestions...</span>
                </div>
              )}

              {topQuestionsData?.questions &&
                topQuestionsData.questions.length > 0 && (
                  <CommandGroup heading="Top Questions">
                    {topQuestionsData.questions.map((question) => (
                      <CommandItem
                        key={question.id}
                        value={`top-question-${question.id}`}
                        className="smooth-hover py-2!"
                        onSelect={() =>
                          handleSelect(`/questions/${question.id}`)
                        }
                      >
                        <Flame className="text-orange-500" />
                        <span className="flex-1 truncate">
                          {question.title}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

              {popularTagsData?.tags && popularTagsData.tags.length > 0 && (
                <CommandGroup heading="Popular Tags">
                  {popularTagsData.tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={`popular-tag-${tag.id}`}
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

              {!isLoadingTopQuestions &&
                !isLoadingPopularTags &&
                !topQuestionsData?.questions?.length &&
                !popularTagsData?.tags?.length && (
                  <CommandEmpty>
                    Type at least 2 characters to search...
                  </CommandEmpty>
                )}
            </>
          )}

          {!isSearching &&
            !hasNetworkError &&
            query.length >= 2 &&
            !hasResults && (
              <CommandEmpty>
                No results found for &ldquo;{query}&rdquo;
              </CommandEmpty>
            )}

          {hasResults && !showSuggestions && (
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
                          `/questions/${answer.questionId}?answerId=${answer.id}#answer-${answer.id}`
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
