import EditorFallback from "@/components/editor/EditorFallback";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import QuestionHeaderSkeleton from "@/components/skeletons/QuestionHeaderSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      {/* Question Header Skeleton */}
      <QuestionHeaderSkeleton />

      {/* Question Content Skeleton */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Tags Skeleton */}
      <div className="mt-8 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-8 w-20 rounded-md" />
        ))}
      </div>

      {/* Separator */}
      <div className="mt-10 h-px bg-light700_dark400" />

      {/* Answers Section Skeleton */}
      <div className="mt-10 flex-between pb-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
      <PostCardsSkeleton className="my-6" />

      {/* Answer Form Skeleton */}
      <div className="pt-10 flex flex-col gap-10">
        <div className="flex-between w-full">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <EditorFallback />
        <div className="flex-end w-full">
          <Skeleton className="h-10 w-28 mb-10" />
        </div>
      </div>
    </>
  );
};

export default Loading;
