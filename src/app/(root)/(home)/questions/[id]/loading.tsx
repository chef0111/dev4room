import EditorFallback from "@/components/markdown/EditorFallback";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";
import QuestionHeaderSkeleton from "@/components/skeletons/QuestionHeaderSkeleton";
import { Skeleton, Button } from "@/components/ui";
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
      <div className="bg-light700_dark400 mt-10 h-px" />

      {/* Answers Section Skeleton */}
      <div className="flex-between mt-10 pb-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
      <PostCardsSkeleton className="my-6" />

      {/* Answer Form Skeleton */}
      <div className="flex flex-col gap-10 pt-10">
        <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row sm:items-center sm:gap-2">
          <h4 className="pg-semibold text-dark400_light800">
            Write your answer here
          </h4>
          <Button
            className="btn light-border-2 text-link-100 gap-1 rounded-md border px-4 py-2 shadow-none"
            disabled
          >
            <BsStars className="size-4 text-orange-300" />
            Generate AI Answer
          </Button>
        </div>
        <EditorFallback />
        <div className="flex-end w-full">
          <Button className="primary-gradient text-light-900 w-fit" disabled>
            Post Answer
          </Button>
        </div>
      </div>
    </>
  );
};

export default Loading;
