import TagCard from "@/components/modules/tags/tag-card";
import DataRenderer from "@/components/shared/data-renderer";
import { getErrorMessage } from "@/lib/handlers/error";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";

const DEFAULT_LIMIT = 5;

const PopularTags = async () => {
  const queryClient = getQueryClient();
  const queryOptions = orpc.tag.getPopular.queryOptions({
    input: { limit: DEFAULT_LIMIT },
  });

  const result = await queryClient
    .fetchQuery(queryOptions)
    .then((data) => ({ data: data.tags, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to get popular tags") },
    }));

  const popularTags = result.data;

  return (
    <DataRenderer
      data={popularTags ?? []}
      success={!!popularTags}
      error={result.error}
      empty={{
        title: "No tags found",
        message: "No tags have been created yet.",
      }}
      render={(popularTags) => (
        <div className="mt-6 flex flex-col gap-4">
          {popularTags.map(({ id, name, questions }) => (
            <TagCard
              key={id}
              id={id}
              name={name}
              questions={questions}
              showCount={true}
              compact={true}
            />
          ))}
        </div>
      )}
    />
  );
};

export default PopularTags;
