import { Suspense } from "react";
import TopQuestionsSkeleton from "@/components/skeletons/TopQuestionsSkeleton";
import TopQuestions from "./TopQuestions";
import TopTagsSkeleton from "@/components/skeletons/TopTagsSkeleton";
import PopularTags from "./PopularTags";

const RightSidebar = () => {
  return (
    <section className="no-scrollbar bg-light900_dark200 fixed light-border right-0 top-0 h-screen w-75 flex flex-col justify-start border-l p-5 pt-32 shadow-light-300 dark:shadow-none overflow-y-auto max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <Suspense fallback={<TopQuestionsSkeleton />}>
          <TopQuestions />
        </Suspense>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <Suspense fallback={<TopTagsSkeleton />}>
          <PopularTags />
        </Suspense>
      </div>
    </section>
  );
};

export default RightSidebar;
