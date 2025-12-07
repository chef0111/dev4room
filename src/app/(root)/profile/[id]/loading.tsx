import { Skeleton } from "@/components/ui";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import ProfileHeaderSkeleton from "@/components/skeletons/ProfileHeaderSkeleton";
import ProfileStatsSkeleton from "@/components/skeletons/ProfileStatsSkeletion";
import TopTagsSkeleton from "@/components/skeletons/TopTagsSkeleton";

const Loading = () => {
  return (
    <>
      <section className="flex w-full items-start justify-between">
        <ProfileHeaderSkeleton />
      </section>

      <div className="mt-8">
        <ProfileStatsSkeleton />
      </div>
      <section className="mt-10 flex gap-10">
        <div className="mt-4 flex flex-col w-full gap-6">
          <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
            <Skeleton className="h-12 sm:w-48 max-sm:w-full rounded-md" />
            <Skeleton className="h-12 sm:w-40 max-sm:w-full rounded-md" />
          </div>
          <PostCardsSkeleton className="mt-2" />
        </div>

        <div className="mt-4 flex w-full min-w-60 flex-1 flex-col max-lg:hidden">
          <Skeleton className="h-10 w-36 rounded-md" />
          <TopTagsSkeleton className="mt-10" />
        </div>
      </section>
    </>
  );
};

export default Loading;
