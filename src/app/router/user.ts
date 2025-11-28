import { base } from "@/app/middleware";
import { getUsers } from "@/server/user/user.dal";
import { QueryParamsSchema } from "@/lib/validations";
import { UsersListOutputSchema } from "@/server/user/user.dto";

export const listUsers = base
  .route({
    method: "GET",
    path: "/users",
    summary: "List Users",
    tags: ["Users"],
  })
  .input(QueryParamsSchema)
  .output(UsersListOutputSchema)
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
