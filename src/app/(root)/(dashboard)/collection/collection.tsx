import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/question-card";
import { NextPagination } from "@/components/ui/dev";

const Collection = async ({
  searchParams,
}: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.collection.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
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
  const totalCollections = data?.totalCollections || 0;

  return (
    <>
      <DataRenderer
        success={!!data}
        error={result.error}
        data={data?.collections}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className="my-10 flex w-full flex-col gap-6">
            {collections.map((item) => (
              <QuestionCard key={item.id} question={item.question} />
            ))}
          </div>
        )}
      />

      <NextPagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCollections}
        className="pb-10"
      />
    </>
  );
};

export default Collection;
