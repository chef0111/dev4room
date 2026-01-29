"use cache";

import Image from "next/image";
import Link from "next/link";
import { getTopQuestions } from "@/app/server/question/question.dal";
import { getErrorMessage } from "@/lib/handlers/error";
import DataRenderer from "@/components/shared/data-renderer";
import { ChevronRight } from "lucide-react";

const DEFAULT_LIMIT = 5;

async function fetchTopQuestions(limit: number) {
  return await getTopQuestions(limit)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get top questions") },
    }));
}

const TopQuestions = async () => {
  const result = await fetchTopQuestions(DEFAULT_LIMIT);

  const topQuestions = result.data;

  return (
    <DataRenderer
      data={topQuestions ?? []}
      success={!!result.data}
      error={result.error}
      empty={{
        title: "No questions found",
        message: "No questions have been asked yet.",
      }}
      render={(topQuestions) => (
        <ul className="mt-6 flex w-full flex-col gap-5">
          {topQuestions.map(({ id, title }, index) => (
            <li key={index}>
              <Link
                href={`/questions/${id}`}
                className="flex-between group cursor-pointer gap-4"
              >
                <Image
                  src={
                    index % 2 === 0
                      ? "/icons/question-blue.svg"
                      : "/icons/question-orange.svg"
                  }
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />

                <p
                  className="body-medium ease group-hover:text-link-100 group-hover:text-shadow-link-100 line-clamp-2 block flex-1 overflow-hidden text-left text-ellipsis transition-all duration-200 group-hover:translate-x-2 group-hover:transform"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {title}
                </p>

                <ChevronRight
                  className="text-dark400_light900 ease h-5 w-5 -translate-x-6 scale-0 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    />
  );
};

export default TopQuestions;
