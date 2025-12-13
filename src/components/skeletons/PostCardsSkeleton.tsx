import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const PostCardsSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Skeleton key={item} className="h-44 w-full rounded-2xl" />
      ))}
    </div>
  );
};

export default PostCardsSkeleton;
