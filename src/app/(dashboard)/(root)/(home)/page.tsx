import Link from "next/link";

import { Button } from "@/components/ui/button";
import routes from "@/common/constants/routes";
import LocalSearch from "@/components/layout/main/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/layout/questions/QuestionCard";

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
  const { query = "", filter = "" } = await searchParams;
  // const data = axios.get("/api/questions", { query: { search: query } });

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    // const matchesFilter = filter
    //   ? question.tags.some(
    //       (tag) => tag.name.toLowerCase() === filter.toLowerCase()
    //     )
    //   : true;
    return matchesQuery;
  });

  return (
    <>
      {/* Ask a question section */}
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-10 px-4 py-3 text-light-900! hover:primary-gradient-hover cursor-pointer"
          asChild
        >
          <Link href={routes.askQuestion}>Ask Question</Link>
        </Button>
      </section>
      <section className="mt-10">
        <LocalSearch
          route="/"
          placeholder="Search a question here..."
          className="flex-1"
        />
        <HomeFilter />
      </section>

      <div className="flex flex-col my-10 w-full gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </>
  );
};

export default HomePage;
