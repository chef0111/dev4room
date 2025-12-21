import { Skeleton } from "@/components/ui/skeleton";

const ProfileStatsSkeleton = () => {
  return (
    <div className="xs:grid-cols-2 mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <Skeleton key={item} className="h-20 w-full rounded-md" />
      ))}
    </div>
  );
};

export default ProfileStatsSkeleton;
