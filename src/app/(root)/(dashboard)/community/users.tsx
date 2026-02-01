import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { resolveData, safeFetch } from "@/lib/query/helper";
import { UserListDTO } from "@/app/server/user/user.dto";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_USERS } from "@/common/constants/states";
import UserCard from "@/components/modules/profile/user-card";
import { NextPagination } from "@/components/ui/dev";

const Users = async ({ searchParams }: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.users.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 12,
      query,
      filter,
    },
  });

  const result = await safeFetch<UserListDTO>(
    queryClient.fetchQuery(queryOptions),
    "Failed to get users"
  );

  const {
    data: users,
    success,
    error,
  } = resolveData(result, (data) => data.users, []);

  const { data: totalUsers } = resolveData(
    result,
    (data) => data.totalUsers,
    0
  );

  return (
    <>
      <DataRenderer
        data={users}
        success={success}
        error={error}
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
    </>
  );
};

export default Users;
