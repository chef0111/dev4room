import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import ProfileHeader from "@/components/layout/profile/ProfileHeader";
import UserStats from "@/components/layout/profile/UserStats";
import UserTabs from "@/components/layout/profile/UserTabs";
import UserTopTags from "@/components/layout/profile/UserTopTags";
import UserTabsSkeleton from "@/components/skeletons/UserTabsSkeleton";
import UserTopTagsSkeleton from "@/components/skeletons/UserTopTagsSkeleton";
import { Button } from "@/components/ui";

const ProfilePage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) notFound();

  const queryClient = getQueryClient();

  // Get logged in user session
  const session = await authClient.getSession();
  const isOwner = session?.data?.user?.id === id;

  // Fetch user data
  const userResult = await queryClient
    .fetchQuery(
      orpc.user.get.queryOptions({
        input: { userId: id },
      }),
    )
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to fetch user") },
    }));

  if (!userResult.data) {
    return (
      <div className="flex-center flex-col gap-4">
        <h1 className="h1-bold text-dark100_light900">User not found</h1>
        <p className="pg-regular text-dark200_light800 max-w-md">
          {userResult.error?.message}
        </p>
      </div>
    );
  }

  const { user, totalQuestions, totalAnswers } = userResult.data;

  // Fetch user stats
  const statsResult = await queryClient
    .fetchQuery(
      orpc.user.stats.queryOptions({
        input: { userId: id },
      }),
    )
    .then((data) => ({ data, error: undefined }))
    .catch(() => ({ data: undefined, error: undefined }));

  const userStats = statsResult.data;

  return (
    <>
      <section className="flex w-full flex-col-reverse items-start justify-between sm:flex-row">
        <ProfileHeader
          id={user.id}
          name={user.name}
          username={user.username}
          image={user.image}
          portfolio={user.portfolio}
          location={user.location}
          createdAt={user.createdAt}
          bio={user.bio}
        />

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full">
          {isOwner && (
            <Button
              className="pg-medium btn-secondary hover:bg-light700_dark300! text-dark300_light900 min-h-12 min-w-40 max-sm:w-full px-4 py-3 transition-all duration-200 cursor-pointer"
              asChild
            >
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          )}
        </div>
      </section>

      <UserStats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={user.reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Suspense fallback={<UserTabsSkeleton />}>
          <UserTabs
            userId={id}
            user={user}
            page={Number(page) || 1}
            pageSize={Number(pageSize) || 10}
            isOwner={isOwner}
          />
        </Suspense>

        <Suspense fallback={<UserTopTagsSkeleton />}>
          <UserTopTags userId={id} />
        </Suspense>
      </section>
    </>
  );
};

export default ProfilePage;
