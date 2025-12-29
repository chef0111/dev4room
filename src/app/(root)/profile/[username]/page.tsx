import { Suspense } from "react";
import { notFound } from "next/navigation";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { getServerSession } from "@/lib/session";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { getErrorMessage } from "@/lib/handlers/error";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import ProfileHeader from "./header";
import UserStats from "./user-stats";
import UserTabs from "./user-tabs";
import UserTopTags from "./top-tags";
import { UserTabsSkeleton, UserTopTagsSkeleton } from "@/components/skeletons";

export async function generateStaticParams() {
  const users = await db.select({ username: user.username }).from(user);
  return users.map((u) => ({ username: u.username }));
}

const ProfilePage = async ({ params, searchParams }: RouteParams) => {
  const { username } = await params;
  const { page, pageSize, filter } = await searchParams;

  if (!username) notFound();

  const queryClient = getQueryClient();

  const userResult = await queryClient
    .fetchQuery(
      orpc.user.get.queryOptions({
        input: { username },
      })
    )
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined,
      error: { message: getErrorMessage(e, "Failed to fetch user") },
    }));

  if (!userResult.data) return notFound();

  const { user: userData, totalQuestions, totalAnswers } = userResult.data;

  const session = await getServerSession();
  const isAuthor = session?.user?.id === userData.id;

  const statsResult = await queryClient
    .fetchQuery(
      orpc.user.stats.queryOptions({
        input: { userId: userData.id },
      })
    )
    .then((data) => ({ data, error: undefined }))
    .catch(() => ({ data: undefined, error: undefined }));

  const userStats = statsResult.data;

  return (
    <>
      <section className="flex w-full flex-col-reverse items-start justify-between sm:flex-row">
        <ProfileHeader
          id={userData.id}
          name={userData.name}
          username={userData.username}
          image={userData.image}
          portfolio={userData.portfolio}
          location={userData.location}
          createdAt={userData.createdAt}
          bio={userData.bio}
        />

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full">
          {isAuthor && (
            <Button
              asChild
              className="pg-medium btn-secondary hover:bg-light700_dark300! text-dark300_light900 min-h-12 min-w-40 px-4 py-3 max-sm:w-full"
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
        reputationPoints={userData.reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Suspense fallback={<UserTabsSkeleton />}>
          <UserTabs
            userId={userData.id}
            user={userData}
            page={Number(page) || 1}
            pageSize={Number(pageSize) || 10}
            filter={filter}
            isAuthor={isAuthor}
          />
        </Suspense>

        <Suspense fallback={<UserTopTagsSkeleton />}>
          <UserTopTags userId={userData.id} />
        </Suspense>
      </section>
    </>
  );
};

export default ProfilePage;
