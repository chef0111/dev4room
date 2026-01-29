import { listCollection } from "@/app/server/collection/collection.dal";
import { getServerSession } from "@/lib/session";
import { getErrorMessage } from "@/lib/handlers/error";
import type { CollectionItem } from "@/app/server/collection/collection.dto";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_QUESTION } from "@/common/constants/states";
import QuestionCard from "@/components/modules/questions/question-card";
import { NextPagination } from "@/components/ui/dev";

async function fetchCollections(
  userId: string,
  page: number,
  pageSize: number,
  query?: string,
  filter?: string
) {
  "use cache";

  return await listCollection({ page, pageSize, query, filter }, userId)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as
        | { collections: CollectionItem[]; totalCollections: number }
        | undefined,
      error: { message: getErrorMessage(e, "Failed to get questions") },
    }));
}

const Collection = async ({
  searchParams,
}: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;
  const session = await getServerSession();

  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 10;

  if (!session?.user?.id) {
    return (
      <DataRenderer
        data={[]}
        success={false}
        error={{ message: "Please login to view your collection" }}
        empty={EMPTY_QUESTION}
        render={() => null}
      />
    );
  }

  const result = await fetchCollections(
    session.user.id,
    parsedPage,
    parsedPageSize,
    query,
    filter
  );

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
        page={parsedPage}
        pageSize={parsedPageSize}
        totalCount={totalCollections}
        className="pb-10"
      />
    </>
  );
};

export default Collection;
