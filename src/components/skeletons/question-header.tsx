import { Skeleton } from "@/components/ui/skeleton";
import QuestionUtilsFallback from "@/components/modules/questions/question-utils-fallback";

const QuestionHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-md" />
        </div>
        <QuestionUtilsFallback />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-[40%]" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

export default QuestionHeaderSkeleton;
