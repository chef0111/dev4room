import { getUsers } from "@/app/server/user/user.dal";
import { getErrorMessage } from "@/lib/handlers/error";
import type { UserDTO } from "@/app/server/user/user.dto";

import DataRenderer from "@/components/shared/data-renderer";
import { EMPTY_USERS } from "@/common/constants/states";
import UserCard from "@/components/modules/profile/user-card";
import { NextPagination } from "@/components/ui/dev";

async function fetchUsers(
  page: number,
  pageSize: number,
  query?: string,
  filter?: string
) {
  "use cache";

  return await getUsers({ page, pageSize, query, filter })
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as { users: UserDTO[]; totalUsers: number } | undefined,
      error: { message: getErrorMessage(e, "Failed to fetch users data") },
    }));
}

const Users = async ({ searchParams }: Pick<RouteParams, "searchParams">) => {
  const { page, pageSize, query, filter } = await searchParams;

  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 12;

  const result = await fetchUsers(parsedPage, parsedPageSize, query, filter);

  const data = result.data;
  const totalUsers = data?.totalUsers || 0;
  return (
    <>
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
        page={parsedPage}
        pageSize={parsedPageSize}
        totalCount={totalUsers}
        className="pb-10"
      />
    </>
  );
};

export default Users;
