import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import LocalSearch from "@/components/modules/main/LocalSearch";
import Filter from "@/components/filters/Filter";
import FilterContent from "@/components/filters/FilterContent";
import { FilterProvider } from "@/context";
import { UserFilters } from "@/common/constants/filters";
import { EMPTY_USERS } from "@/common/constants/states";
import DataRenderer from "@/components/shared/DataRenderer";
import UserCard from "@/components/modules/profile/UserCard";
import { NextPagination } from "@/components/ui/dev";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.user.list.queryOptions({
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
      error: { message: getErrorMessage(e, "Failed to fetch users data") },
    }));

  const data = result.data;
  const totalUsers = data?.totalUsers || 0;

  return (
    <FilterProvider>
      <div>
        <h1 className="h1-bold text-dark100_light900">All Users</h1>

        <section className="mt-10 flex justify-between gap-4 max-sm:flex-col sm:items-center">
          <LocalSearch
            route="/community"
            placeholder="Search some great developers..."
            className="flex-1 grow"
          />
          <Filter
            filters={UserFilters}
            className="min-h-12 w-full sm:min-w-33"
          />
        </section>

        <FilterContent loadingMessage="Loading...">
          <DataRenderer
            data={data?.users ?? []}
            success={!!data}
            error={result.error}
            empty={EMPTY_USERS}
            render={(users) => (
              <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                {users.map((user) => (
                  <UserCard key={user.id} {...user} />
                ))}
              </div>
            )}
          />

          <NextPagination
            page={page}
            pageSize={pageSize || 12}
            totalCount={totalUsers}
            className="pb-10"
          />
        </FilterContent>
      </div>
    </FilterProvider>
  );
};

export default Community;
