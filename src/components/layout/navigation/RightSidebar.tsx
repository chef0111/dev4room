import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../tags/TagCard";

const topQuestions = [
  { id: "1", title: "How to create a custom hook in React?" },
  { id: "2", title: "How to center a div?" },
  { id: "3", title: "How to create a context API?" },
  { id: "4", title: "Difference between useState and useReducer?" },
  { id: "5", title: "How to use Tanstack Query?" },
];

const popularTags = [
  { id: "1", name: "react", questions: 1000 },
  { id: "2", name: "typescript", questions: 780 },
  { id: "3", name: "tailwindcss", questions: 460 },
  { id: "4", name: "next.js", questions: 820 },
  { id: "5", name: "git", questions: 540 },
];

const RightSidebar = () => {
  return (
    <section className="no-scrollbar bg-light900_dark200 fixed light-border right-0 top-0 h-screen w-75 flex flex-col justify-start border-l p-5 pt-32 shadow-light-300 dark:shadow-none overflow-y-auto max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-6 flex flex-col w-full gap-5">
          {topQuestions.map(({ id, title }, index) => (
            <Link
              key={index}
              href={`/questions/${id}`}
              className="flex-between cursor-pointer gap-4 group"
            >
              <Image
                src={
                  index % 2 === 0
                    ? "/icons/question-blue.svg"
                    : "/icons/question-orange.svg"
                }
                alt="Question Icon"
                width={24}
                height={24}
              />

              <p
                className="block body-medium flex-1 text-left line-clamp-2 overflow-hidden text-ellipsis transition-all duration-200 ease group-hover:text-link-100 group-hover:text-shadow-link-100 group-hover:transform group-hover:translate-x-2"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {title}
              </p>

              <ChevronRight className="text-dark400_light900 w-5 h-5 transform opacity-0 -translate-x-6 scale-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-6 flex flex-col gap-4">
          {popularTags.map(({ id, name, questions }) => (
            <TagCard
              key={id}
              id={id}
              name={name}
              questions={questions}
              showCount={true}
              compact={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
