import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui";
import QuestionUtilsFallback from "../modules/questions/QuestionUtilsFallback";

const QuestionContentSkeleton = () => {
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full justify-between">
          <div className="flex-start gap-1">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>

          <div className="flex-end gap-2">
            <QuestionUtilsFallback />
          </div>
        </div>

        <Skeleton className="mt-3 h-8 w-full rounded-md" />
        <Skeleton className="mt-2 h-8 w-3/4 rounded-md" />
      </div>

      <div className="mt-4 mb-8 flex flex-wrap gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="flex-between mt-8">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>
      </div>

      <Separator className="bg-light700_dark400 mt-10 h-1" />
    </>
  );
};

export default QuestionContentSkeleton;
