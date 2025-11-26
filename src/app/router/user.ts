import { base } from "@/app/middleware";
import { getUsers } from "@/server/user/user.dal";
import { QueryParamsSchema } from "@/lib/validations";

export const listUsers = base
  .input(QueryParamsSchema)
  .handler(async ({ input }) => {
    const { users, totalUsers } = await getUsers(input);

    return {
      users,
      totalUsers,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.ceil(totalUsers / input.pageSize),
    };
  });
