import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import LocalSearch from "@/components/layout/main/LocalSearch";
import Filter from "@/components/filters/Filter";
import { CollectionFilters } from "@/common/constants/filters";
import DataRenderer from "@/components/shared/DataRenderer";
import QuestionCard from "@/components/layout/questions/QuestionCard";
import { EMPTY_QUESTION } from "@/common/constants/states";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.collection.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 12,
      query,
      filter,
    },
  });

  const result = await queryClient
    .fetchQuery(queryOptions)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get questions") },
    }));

  const data = result.data;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-10 flex justify-between sm:items-center max-sm:flex-col gap-4">
        <LocalSearch
          route="/collection"
          placeholder="Search a question here..."
          className="flex-1"
        />

        <Filter
          filters={CollectionFilters}
          className="min-h-12 w-full sm:min-w-44"
        />
      </div>

      <DataRenderer
        success={!!data}
        error={result.error}
        data={data?.collections}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className="flex flex-col my-10 w-full gap-6">
            {collections.map((item) => (
              <QuestionCard key={item.id} question={item.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collections;
