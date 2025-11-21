// "use server";

import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { getUsers } from "@/server/user/user.dal";
import type { UsersDTO } from "@/server/user/user.dto";
import { QueryParamsSchema } from "@/lib/validations";

interface UsersParams {
  users: UsersDTO[];
  totalUsers: number;
}

export async function fetchUsers(
  params: QueryParams,
): Promise<ActionResponse<UsersParams>> {
  const validationResult = await action({
    params,
    schema: QueryParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const validatedParams = validationResult.params!;

  try {
    const { users, totalUsers } = await getUsers(validatedParams);

    return {
      success: true,
      data: {
        users,
        totalUsers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
