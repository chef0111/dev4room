import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { resolveData, safeFetch } from "@/lib/query/helper";
import { TagListDTO } from "@/app/server/tag/tag.dto";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_TAGS } from "@/common/constants/states";
import TagCard from "@/components/modules/tags/tag-card";
import { NextPagination } from "@/components/ui/dev";

const Tags = async ({ searchParams }: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.tags.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 12,
      query,
      filter,
    },
  });

  const result = await safeFetch<TagListDTO>(
    queryClient.fetchQuery(queryOptions),
    "Failed to get tags"
  );

  const {
    data: tags,
    success,
    error,
  } = resolveData(result, (data) => data.tags, []);

  const { data: totalTags } = resolveData(result, (data) => data.totalTags, 0);

  return (
    <>
      <DataRenderer
        data={tags}
        success={success}
        error={error}
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
