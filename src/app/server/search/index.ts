import { base } from "@/app/middleware";
import { search as searchDAL } from "./search.dal";
import { SearchInputSchema, SearchResultSchema } from "./search.dto";

export const search = base
  .route({
    method: "POST",
    path: "/search",
    summary: "Semantic Search",
    description:
      "Search across questions, answers, tags, and users using semantic similarity",
    tags: ["Search"],
  })
  .input(SearchInputSchema)
  .output(SearchResultSchema)
  .handler(async ({ input }) => {
    return searchDAL(input);
  });
