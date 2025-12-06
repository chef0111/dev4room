import EditorFallback from "@/components/editor/EditorFallback";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import QuestionHeaderSkeleton from "@/components/skeletons/QuestionHeaderSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BsStars } from "react-icons/bs";

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
        <div className="flex flex-col justify-between pt-4 gap-4 sm:flex-row sm:items-center sm:gap-2">
          <h4 className="pg-semibold text-dark400_light800">
            Write your answer here
          </h4>
          <Button
            className="btn light-border-2 gap-1 rounded-md border px-4 py-2 text-link-100 shadow-none"
            disabled
          >
            <BsStars className="text-orange-300 size-4" />
            Generate AI Answer
          </Button>
        </div>
        <EditorFallback />
        <div className="flex-end w-full">
          <Button className="primary-gradient w-fit text-light-900" disabled>
            Post Answer
          </Button>
        </div>
      </div>
    </>
  );
};

export default Loading;
