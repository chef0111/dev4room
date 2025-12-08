import { Skeleton } from "@/components/ui";

const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row max-sm:flex-row">
      <div>
        <Skeleton className="size-35 max-sm:size-28 rounded-full" />
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="h-5 w-32 rounded-full" />

        <div className="mt-4 flex-start gap-2">
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              className="h-5 w-24 max-sm:w-full rounded-full"
            />
          ))}
        </div>

        <Skeleton className="max-sm:hidden mt-4 h-4 w-full lg:w-88 xl:w-140" />
        <Skeleton className="max-sm:hidden h-4 w-[60%]" />
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
