import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { getServerSession } from "@/lib/session";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";
import { resolveData, safeFetch } from "@/lib/query/helper";
import { GetUserDTO, UserStatsDTO } from "@/app/server/user/user.dto";

import { Button } from "@/components/ui/button";
import ProfileHeader from "./header";
import UserStats from "./user-stats";
import UserTabs from "./user-tabs";
import UserTopTags from "./top-tags";
import { Spinner } from "@/components/ui";
import ContributionGraphDisplay from "@/components/modules/profile/contributions/graph";
import YearSelect from "@/components/modules/profile/contributions/year-select";
import { currentYear, getYearOptions } from "@/lib/utils";
import { FilterProvider } from "@/context";
import { baseUrl } from "@/common/constants";

export async function generateStaticParams() {
  const users = await db.select({ username: user.username }).from(user);
  return users.map((u) => ({ username: u.username }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { username } = await params;

  const [userData] = await db
    .select({
      name: user.name,
      username: user.username,
      bio: user.bio,
      image: user.image,
    })
    .from(user)
    .where(eq(user.username, username))
    .limit(1);

  if (!userData) {
    return {
      title: "User Not Found",
    };
  }

  const description =
    userData.bio ||
    `View ${userData.name}'s profile on Dev4Room. See their questions, answers, and contributions to the community.`;

  return {
    title: `${userData.name} (@${userData.username})`,
    description,
    openGraph: {
      title: `${userData.name} (@${userData.username}) | Dev4Room`,
      description,
      url: `${baseUrl}/${userData.username}`,
      type: "profile",
      ...(userData.image && {
        images: [{ url: userData.image, alt: `${userData.name}'s avatar` }],
      }),
    },
    twitter: {
      card: "summary",
      title: `${userData.name} (@${userData.username}) | Dev4Room`,
      description,
      ...(userData.image && { images: [userData.image] }),
    },
    alternates: {
      canonical: `${baseUrl}/${userData.username}`,
    },
  };
}

const ProfilePage = async ({ params, searchParams }: RouteParams) => {
  const { username } = await params;
  const { page, pageSize, filter, year } = await searchParams;

  if (!username) notFound();

  const queryClient = getQueryClient();

  const userResult = await safeFetch<GetUserDTO>(
    queryClient.fetchQuery(
      orpc.users.me.queryOptions({
        input: { username },
      })
    ),
    "Failed to fetch user profile"
  );

  const { data: user } = resolveData(userResult, (d) => d.user, null);
  const { data: totalQuestions } = resolveData(
    userResult,
    (d) => d.totalQuestions,
    0
  );
  const { data: totalAnswers } = resolveData(
    userResult,
    (d) => d.totalAnswers,
    0
  );

  if (!user) return notFound();

  const session = await getServerSession();
  const isAuthor = session?.user?.id === user.id;

  const statsResult = await safeFetch<UserStatsDTO>(
    queryClient.fetchQuery(
      orpc.users.stats.queryOptions({
        input: { userId: user.id },
      })
    ),
    "Failed to fetch user stats"
  );

  const { data: stats } = resolveData(statsResult, (data) => data, null);

  // Generate year options from user's join year to current year
  const contributionFilters = getYearOptions(user.createdAt);
  const selectedYear = year ? parseInt(year, 10) : currentYear;

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
        badges={stats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={user.reputation || 0}
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
                    userId={user.id}
                    year={selectedYear}
                  />
                </article>
              </FilterProvider>
            </div>

            <UserTabs
              userId={user.id}
              user={user}
              page={Number(page) || 1}
              pageSize={Number(pageSize) || 10}
              filter={filter}
              isAuthor={isAuthor}
            />
          </div>

          <UserTopTags userId={user.id} />
        </section>
      </Suspense>
    </>
  );
};

export default ProfilePage;
