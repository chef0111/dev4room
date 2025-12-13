import "server-only";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult {
  offset: number;
  limit: number;
}

export function getPagination(
  params: PaginationParams,
  defaults: { page: number; pageSize: number } = { page: 1, pageSize: 10 }
): PaginationResult {
  const page = params.page ?? defaults.page;
  const pageSize = params.pageSize ?? defaults.pageSize;

  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}
