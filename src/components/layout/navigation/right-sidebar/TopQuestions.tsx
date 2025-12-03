import Image from "next/image";
import Link from "next/link";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import DataRenderer from "@/components/shared/DataRenderer";
import { ChevronRight } from "lucide-react";

const TopQuestions = async () => {
  const queryClient = getQueryClient();
  const queryOptions = orpc.question.getTop.queryOptions({
    input: { limit: 5 },
  });

  const result = await queryClient
    .fetchQuery(queryOptions)
    .then((data) => ({ data: data.questions, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get top questions") },
    }));

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
        <ul className="mt-6 flex flex-col w-full gap-5">
          {topQuestions.map(({ id, title }, index) => (
            <li key={index}>
              <Link
                href={`/questions/${id}`}
                className="flex-between cursor-pointer gap-4 group"
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
                  className="block body-medium flex-1 text-left line-clamp-2 overflow-hidden text-ellipsis transition-all duration-200 ease group-hover:text-link-100 group-hover:text-shadow-link-100 group-hover:transform group-hover:translate-x-2"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {title}
                </p>

                <ChevronRight
                  className="text-dark400_light900 w-5 h-5 transform opacity-0 -translate-x-6 scale-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease"
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
