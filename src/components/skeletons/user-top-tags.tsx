import { Skeleton } from "@/components/ui/skeleton";

const UserTopTagsSkeleton = () => {
  return (
    <div className="flex w-full max-w-60 flex-1 flex-col max-lg:hidden">
      <h2 className="h2-bold text-dark200_light900">Top Tech</h2>
      <div className="mt-10 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex-between">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-7 w-12 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTopTagsSkeleton;
