import { Suspense } from "react";
import TopQuestionsSkeleton from "@/components/skeletons/TopQuestionsSkeleton";
import TopQuestions from "./TopQuestions";
import TopTagsSkeleton from "@/components/skeletons/TopTagsSkeleton";
import PopularTags from "./PopularTags";

const RightSidebar = () => {
  return (
    <section className="no-scrollbar bg-light900_dark200 light-border shadow-light-300 fixed top-0 right-0 flex h-screen w-75 flex-col justify-start overflow-y-auto border-l p-5 pt-32 max-xl:hidden dark:shadow-none">
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
