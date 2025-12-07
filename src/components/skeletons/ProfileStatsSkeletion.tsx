import { Skeleton } from "@/components/ui";

const ProfileStatsSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <Skeleton key={item} className="h-20 w-full rounded-md" />
      ))}
    </div>
  );
};

export default ProfileStatsSkeleton;
