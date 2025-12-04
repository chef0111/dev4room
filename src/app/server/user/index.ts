import { base } from "@/app/middleware";
import { getUsers } from "@/app/server/user/user.dal";
import { UserListOutputSchema } from "@/app/server/user/user.dto";
import { QueryParamsSchema } from "@/lib/validations";

export const listUsers = base
  .route({
    method: "GET",
    path: "/user",
    summary: "List Users",
    tags: ["Users"],
  })
  .input(QueryParamsSchema)
  .output(UserListOutputSchema)
  .handler(async ({ input }) => {
    const result = await getUsers(input);
    return result;
  });
