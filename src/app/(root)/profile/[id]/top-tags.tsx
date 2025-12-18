import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import { EMPTY_TAGS } from "@/common/constants/states";

import DataRenderer from "@/components/shared/DataRenderer";
import TagCard from "@/components/modules/tags/TagCard";

interface UserTopTagsProps {
  userId: string;
  limit?: number;
}

const UserTopTags = async ({ userId, limit = 5 }: UserTopTagsProps) => {
  const queryClient = getQueryClient();

  const tagsResult = await queryClient
    .fetchQuery(
      orpc.user.tags.queryOptions({
        input: { userId, limit },
      })
    )
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to fetch tags") },
    }));

  const tags = tagsResult.data?.tags ?? [];

  return (
    <div className="flex w-full max-w-60 flex-1 flex-col max-lg:hidden">
      <h2 className="h2-bold text-dark200_light900">Top Tech</h2>
      <div className="mt-6 flex flex-col gap-4">
        <DataRenderer
          data={tags}
          success={!!tagsResult.data}
          error={tagsResult.error}
          empty={EMPTY_TAGS}
          render={(tags) => (
            <div className="mt-4 flex w-full flex-col gap-4">
              {tags.map((tag) => (
                <TagCard
                  key={tag.id}
                  id={tag.id}
                  name={tag.name}
                  questions={tag.count}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default UserTopTags;
