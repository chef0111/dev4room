import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import FilterContent from "@/components/filters/FilterContent";
import GridCardsSkeleton from "@/components/skeletons/GridCardsSkeleton";
import DataRenderer from "@/components/shared/DataRenderer";
import { EMPTY_USERS } from "@/common/constants/states";
import UserCard from "@/components/modules/profile/UserCard";
import { NextPagination } from "@/components/ui/dev";

const Users = async ({ searchParams }: Omit<RouteParams, "params">) => {
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
    <>
      <FilterContent
        fallback={<GridCardsSkeleton className="mt-10" itemClassName="h-51" />}
        loadingMessage="Loading..."
      >
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
    </>
  );
};

export default Users;
