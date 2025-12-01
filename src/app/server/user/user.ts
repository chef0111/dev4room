import { base } from "@/app/middleware";
import { getUsers } from "@/app/server/user/user.dal";
import {
  UserQuerySchema,
  UsersListOutputSchema,
} from "@/app/server/user/user.dto";

export const listUsers = base
  .route({
    method: "GET",
    path: "/user",
    summary: "List Users",
    tags: ["Users"],
  })
  .input(UserQuerySchema)
  .output(UsersListOutputSchema)
  .handler(async ({ input }) => {
    const result = await getUsers(input);
    return result;
  });
