import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/server/user/user.dal";
import handleError from "@/lib/handlers/error";
import { QueryParamsSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const params = {
      page: Number(searchParams.get("page") ?? "1"),
      pageSize: Number(searchParams.get("pageSize") ?? "10"),
      query: searchParams.get("query") ?? undefined,
      filter: searchParams.get("filter") ?? undefined,
    };

    // Validate query parameters
    const validationResult = QueryParamsSchema.safeParse(params);

    if (!validationResult.success) {
      return handleError(validationResult, "api") as ApiErrorResponse;
    }

    const { page, pageSize, query, filter } = validationResult.data;

    // Fetch users with filters
    const { users, totalUsers } = await getUsers({
      page: Number(page),
      pageSize: Number(pageSize),
      query,
      filter: filter as "newest" | "oldest" | "popular" | undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          totalUsers,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(totalUsers / Number(pageSize)),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}
