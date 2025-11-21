import routes from "@/common/constants/routes";
import { fetchUsers } from "@/server/user/user.action";
import { EMPTY_USERS } from "@/common/constants/states";
import LocalSearch from "@/components/layout/main/LocalSearch";
import UserCard from "@/components/layout/profile/UserCard";
import DataRenderer from "@/components/shared/DataRenderer";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await fetchUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 12,
    query,
    filter,
  });

  const { users } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <section className="mt-10">
        <LocalSearch
          route={routes.community}
          placeholder="Search some great developers..."
          className="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full gap-4">
            {users.map((user) => (
              <UserCard key={user.id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
