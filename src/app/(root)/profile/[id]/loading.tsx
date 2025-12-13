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
        <div className="mt-4 flex w-full flex-col gap-6">
          <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
            <Skeleton className="h-12 rounded-md max-sm:w-full sm:w-48" />
            <Skeleton className="h-12 rounded-md max-sm:w-full sm:w-40" />
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
