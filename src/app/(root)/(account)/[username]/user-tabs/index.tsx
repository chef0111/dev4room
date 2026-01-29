import { fetchUserQuestions, UserQuestions } from "./user-questions";
import { fetchUserAnswers, UserAnswers } from "./user-answers";
import { profileTabs } from "@/common/constants";
import { FilterProvider } from "@/context";
import { AnimatedTab, NextPagination } from "@/components/ui/dev";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Filter from "@/components/filters/filter";
import FilterContent from "@/components/filters/filter-content";
import { UserFilters } from "@/common/constants/filters";

interface UserTabsProps {
  userId: string;
  user: Author;
  page?: number;
  pageSize?: number;
  filter?: string;
  isAuthor?: boolean;
}

const UserTabs = async ({
  userId,
  user,
  page = 1,
  pageSize = 10,
  filter = "popular",
  isAuthor = false,
}: UserTabsProps) => {
  const [questionsResult, answersResult] = await Promise.all([
    fetchUserQuestions(userId, page, pageSize, filter),
    fetchUserAnswers(userId, page, pageSize, filter),
  ]);

  const totalQuestions = questionsResult.data?.totalQuestions ?? 0;
  const totalAnswers = answersResult.data?.totalAnswers ?? 0;

  return (
    <FilterProvider>
      <Tabs defaultValue={profileTabs[0].value} className="flex-2">
        {/* User Questions & Answers tabs */}
        <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
          <TabsList className="bg-light800_dark400 min-h-11 gap-1 rounded-md p-1 max-sm:w-full">
            <AnimatedTab
              defaultValue={profileTabs[0].value}
              className="bg-primary-500 shadow-light-100 rounded-sm"
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
            >
              {profileTabs.map(({ value, label }, index) => (
                <TabsTrigger
                  key={index}
                  value={value}
                  data-id={value}
                  className="tab cursor-pointer p-3"
                >
                  <p className="pg-medium">{label}</p>
                </TabsTrigger>
              ))}
            </AnimatedTab>
          </TabsList>

          <Filter
            filters={UserFilters}
            className="min-h-11 w-full sm:min-w-33"
          />
        </div>

        {/* Display User Questions */}
        <TabsContent
          value={profileTabs[0].value}
          className="mt-4 flex w-full flex-col gap-6"
        >
          <FilterContent loadingMessage="Loading...">
            <div className="mb-10 flex w-full flex-col gap-6">
              <UserQuestions
                user={user}
                data={questionsResult.data}
                error={questionsResult.error}
                isAuthor={isAuthor}
              />

              <NextPagination
                page={page}
                pageSize={pageSize}
                totalCount={totalQuestions}
                className="pb-6"
              />
            </div>
          </FilterContent>
        </TabsContent>

        {/* Display User Answers */}
        <TabsContent
          value="answers"
          className="mt-4 flex w-full flex-col gap-6"
        >
          <FilterContent loadingMessage="Loading...">
            <div className="mb-10 flex w-full flex-col">
              <UserAnswers
                user={user}
                data={answersResult.data}
                error={answersResult.error}
                isAuthor={isAuthor}
              />
              <NextPagination
                page={page}
                pageSize={pageSize}
                totalCount={totalAnswers}
                className="py-6"
              />
            </div>
          </FilterContent>
        </TabsContent>
      </Tabs>
    </FilterProvider>
  );
};

export default UserTabs;
