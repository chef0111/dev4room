import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LocalSearch from "@/components/layout/main/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/layout/questions/QuestionCard";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import { HomePageFilters } from "@/common/constants/filters";
import SearchInput from "@/components/layout/main/SearchInput";

const questions = [
  {
    id: "1",
    title: "How to learn React?",
    content: "I want to learn React, can anyone help me?",
    tags: [
      { id: "1", name: "React" },
      { id: "2", name: "JavaScript" },
    ],
    author: { id: "1", name: "John Doe", image: "/images/default-avatar.png" },
    upvotes: 10,
    downvotes: 0,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "How to learn JavaScript?",
    content: "I want to learn JavaScript, can anyone help me?",
    tags: [
      { id: "1", name: "React" },
      { id: "2", name: "JavaScript" },
    ],
    author: { id: "1", name: "John Doe", image: "/images/default-avatar.png" },
    upvotes: 10,
    downvotes: 0,
    answers: 5,
    views: 100,
    createdAt: new Date("2025-08-01T00:00:00Z"),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const HomePage = async ({ searchParams }: SearchParams) => {
  const { query = "" } = await searchParams;
  // const data = axios.get("/api/questions", { query: { search: query } });

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    // const matchesFilter = filter
    //   ? question.tags.some(
    //       (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
    //     )
    //   : true;

    // console.log(matchesFilter);
    return matchesQuery;
  });

  const searchPlaceholder = "Search a question here...";

  return (
    <>
      {/* Ask a question section */}
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-10 px-4 py-3 text-light-900! hover:primary-gradient-hover cursor-pointer"
          asChild
        >
          <Link href="/ask-question">Ask Question</Link>
        </Button>
      </section>
      <section className="mt-10">
        <Suspense
          fallback={
            <SearchInput
              placeholder={searchPlaceholder}
              className="bg-light800_darkgradient! flex-1 min-h-12 gap-2 px-2"
            />
          }
        >
          <LocalSearch
            route="/"
            placeholder={searchPlaceholder}
            className="flex-1"
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="mt-6 hidden sm:flex flex-wrap gap-3">
              {HomePageFilters.map((filter) => (
                <Button
                  key={filter.label}
                  className="base-filter-btn bg-light800_dark300 text-light-500"
                  disabled
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          }
        >
          <HomeFilter />
        </Suspense>
      </section>

      <div className="flex flex-col my-10 w-full gap-6">
        <Suspense fallback={<PostCardsSkeleton />}>
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
