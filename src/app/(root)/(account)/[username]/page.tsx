import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { getServerSession } from "@/lib/session";
import { getErrorMessage } from "@/lib/handlers/error";

import { Button } from "@/components/ui/button";
import ProfileHeader from "./header";
import UserStats from "./user-stats";
import UserTabs from "./user-tabs";
import UserTopTags from "./top-tags";
import ContributionGraphDisplay from "@/components/modules/profile/contributions/graph";
import YearSelect from "@/components/modules/profile/contributions/year-select";
import { FilterProvider } from "@/context";
import { Spinner } from "@/components/ui";
import { currentYear, getYearOptions } from "@/lib/utils";
import { getUser, getUserStats } from "@/app/server/user/user.dal";
import { GetUserDTO, UserStatsDTO } from "@/app/server/user/user.dto";

export async function generateStaticParams() {
  const users = await db.select({ username: user.username }).from(user);
  return users.map((u) => ({ username: u.username }));
}

async function getUserData(username: string) {
  "use cache";

  return await getUser(username)
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as GetUserDTO | undefined,
      error: { message: getErrorMessage(e, "Failed to get user data") },
    }));
}

async function getUserStat(userId: string) {
  "use cache";

  return await getUserStats({ userId })
    .then((data) => ({ data, error: undefined }))
    .catch((e) => ({
      data: undefined as UserStatsDTO | undefined,
      error: { message: getErrorMessage(e, "Failed to get user stats") },
    }));
}

const ProfilePage = async ({ params, searchParams }: RouteParams) => {
  const { username } = await params;
  const { page, pageSize, filter, year } = await searchParams;

  if (!username) notFound();

  const userResult = await getUserData(username);

  if (!userResult.data) return notFound();

  const { user: userData, totalQuestions, totalAnswers } = userResult.data;

  const session = await getServerSession();
  const isAuthor = session?.user?.id === userData.id;

  const statsResult = await getUserStat(userData.id);

  const userStats = statsResult.data;

  // Generate year options from user's join year to current year
  const contributionFilters = getYearOptions(userData.createdAt);
  const selectedYear = year ? parseInt(year, 10) : currentYear;

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
              <Link href="/settings/profile">Edit Profile</Link>
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

      <Suspense
        fallback={
          <div className="flex-center w-full flex-col gap-4 py-16">
            <Spinner className="size-10 border-5" />
            <p className="text-muted-foreground pg-regular">
              Loading user data...
            </p>
          </div>
        }
      >
        <section className="mt-10 flex gap-10">
          <div className="flex w-full flex-col gap-10">
            <div className="grow space-y-6">
              <FilterProvider>
                <div className="flex-between">
                  <h2 className="h3-semibold">Contributions</h2>
                  <YearSelect data={contributionFilters} className="min-w-26" />
                </div>
                <article className="flex-center">
                  <ContributionGraphDisplay
                    userId={userData.id}
                    year={selectedYear}
                  />
                </article>
              </FilterProvider>
            </div>

            <UserTabs
              userId={userData.id}
              user={userData}
              page={Number(page) || 1}
              pageSize={Number(pageSize) || 10}
              filter={filter}
              isAuthor={isAuthor}
            />
          </div>

          <UserTopTags userId={userData.id} />
        </section>
      </Suspense>
    </>
  );
};

export default ProfilePage;
