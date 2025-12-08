import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import LocalSearch from "@/components/layout/main/LocalSearch";
import Filter from "@/components/filters/Filter";
import FilterContent from "@/components/filters/FilterContent";
import { FilterProvider } from "@/context";
import { TagFilters } from "@/common/constants/filters";
import DataRenderer from "@/components/shared/DataRenderer";
import TagCard from "@/components/layout/tags/TagCard";
import { EMPTY_TAGS } from "@/common/constants/states";
import { NextPagination } from "@/components/ui/dev";

const TagsPage = async ({ searchParams }: RouteParams) => {
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
    <FilterProvider>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-10 flex justify-between sm:items-center max-sm:flex-col gap-4">
        <LocalSearch
          route="/tags"
          placeholder={"Search tags..."}
          className="flex-1"
        />

        <Filter filters={TagFilters} className="min-h-12 sm:min-w-33 w-full" />
      </section>

      <FilterContent loadingMessage="Loading...">
        <DataRenderer
          data={data?.tags}
          success={!!data}
          error={result.error}
          empty={EMPTY_TAGS}
          render={(tags) => (
            <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full gap-4">
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
      </FilterContent>
    </FilterProvider>
  );
};

export default TagsPage;
