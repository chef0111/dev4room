import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";
import LocalSearch from "@/components/layout/main/LocalSearch";
import Filter from "@/components/filters/Filter";
import { UserFilters } from "@/common/constants/filters";
import { EMPTY_USERS } from "@/common/constants/states";
import DataRenderer from "@/components/shared/DataRenderer";
import UserCard from "@/components/layout/profile/UserCard";
import { NextPagination } from "@/components/ui/next-pagination";

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
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <section className="mt-10 flex justify-between sm:items-center max-sm:flex-col gap-4">
        <LocalSearch
          route="/community"
          placeholder="Search some great developers..."
          className="flex-1 grow"
        />
        <Filter filters={UserFilters} className="min-h-12 sm:min-w-33 w-full" />
      </section>

      <DataRenderer
        data={data?.users ?? []}
        success={!!data}
        error={result.error}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full gap-4">
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
    </div>
  );
};

export default Community;
