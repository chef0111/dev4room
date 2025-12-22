import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PostCardsSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-44 w-full rounded-2xl" />
      ))}
    </div>
  );
};

export default PostCardsSkeleton;
