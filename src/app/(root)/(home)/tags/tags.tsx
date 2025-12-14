import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import DataRenderer from "@/components/shared/DataRenderer";
import { EMPTY_TAGS } from "@/common/constants/states";
import TagCard from "@/components/modules/tags/TagCard";
import { NextPagination } from "@/components/ui/dev";

const Tags = async ({ searchParams }: Omit<RouteParams, "params">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.tag.list.queryOptions({
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
      error: { message: getErrorMessage(e, "Failed to get tags") },
    }));

  const data = result.data;
  const totalTags = data?.totalTags || 0;

  return (
    <>
      <DataRenderer
        data={data?.tags}
        success={!!data}
        error={result.error}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="my-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            {tags.map((tag) => (
              <TagCard key={tag.id} {...tag} />
            ))}
          </div>
        )}
      />

      <NextPagination
        page={page}
        pageSize={pageSize || 12}
        totalCount={totalTags}
        className="pb-10"
      />
    </>
  );
};

export default Tags;
