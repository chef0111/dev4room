import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

function buildQueryParams(params?: QueryParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString());
  if (params.query) searchParams.set("query", params.query);
  if (params.filter) searchParams.set("filter", params.filter);

  const queryParams = searchParams.toString();
  return queryParams ? `?${queryParams}` : "";
}

export const api = {
  users: {
    getAll: (params?: QueryParams) => {
      const url = `${API_BASE_URL}/user${buildQueryParams(params)}`;
      return fetchHandler(url);
    },
  },
};
