import {
  ProfileHeaderSkeleton,
  ProfileStatsSkeleton,
} from "@/components/skeletons";
import { Spinner } from "@/components/ui";

const Loading = () => {
  return (
    <>
      <section className="flex w-full items-start justify-between">
        <ProfileHeaderSkeleton />
      </section>

      <div className="mt-8">
        <ProfileStatsSkeleton />
      </div>
      <div className="flex-center w-full flex-col gap-4 py-16">
        <Spinner className="size-10 border-5" />
        <p className="text-muted-foreground pg-regular">Loading user data...</p>
      </div>
    </>
  );
};

export default Loading;
