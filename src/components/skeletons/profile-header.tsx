import { Skeleton } from "@/components/ui";

const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-4 max-sm:flex-row md:flex-row">
      <div>
        <Skeleton className="size-35 rounded-full max-sm:size-28" />
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="h-5 w-32 rounded-full" />

        <div className="flex-start mt-4 gap-2">
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              className="h-5 w-24 rounded-full max-sm:w-full"
            />
          ))}
        </div>

        <Skeleton className="mt-4 h-4 w-full max-sm:hidden lg:w-88 xl:w-140" />
        <Skeleton className="h-4 w-[60%] max-sm:hidden" />
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
