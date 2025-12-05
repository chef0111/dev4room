import { Skeleton } from "@/components/ui/skeleton";

const TopQuestionsSkeleton = () => {
  return (
    <div className="mt-6 flex flex-col w-full gap-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex-between gap-4">
          <Skeleton className="w-8 h-6.5 py-0! rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default TopQuestionsSkeleton;
