import { getTags } from "@/app/server/tag/tag.dal";
import { TagsDTO } from "@/app/server/tag/tag.dto";
import { getErrorMessage } from "@/lib/handlers/error";
import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_TAGS } from "@/common/constants/states";
import TagCard from "@/components/modules/tags/tag-card";
import { NextPagination } from "@/components/ui/dev";

async function fetchTags(
  page: number,
  pageSize: number,
  query?: string,
  filter?: string
) {
  "use cache";

  return getTags({ page, pageSize, query, filter })
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as { tags: TagsDTO[]; totalTags: number } | undefined,
      error: { message: getErrorMessage(e, "Failed to get tags") },
    }));
}

const Tags = async ({ searchParams }: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const result = await fetchTags(
    Number(page) || 1,
    Number(pageSize) || 12,
    query,
    filter
  );

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
