import { Skeleton } from "@/components/ui/skeleton";

const TopQuestionsSkeleton = () => {
  return (
    <div className="mt-6 flex w-full flex-col gap-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex-between gap-4">
          <Skeleton className="h-6.5 w-8 rounded-md py-0!" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default TopQuestionsSkeleton;
