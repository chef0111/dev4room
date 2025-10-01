import { HomePageFilters } from "@/common/constants/filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PostCardsSkeleton from "@/components/skeletons/PostCardsSkeleton";

const HomeLoading = () => {
  return (
    <>
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="primary-gradient min-h-10 px-4 py-3 text-light-900! pointer-events-none">
          Ask Question
        </Button>
      </section>
      <section className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <div className="bg-light800_darkgradient! flex items-center min-h-12 grow gap-2 rounded-lg px-4">
          <Search className="text-light400_light500 w-6 h-6" />
          <Input
            type="text"
            placeholder="Search a question here..."
            disabled
            className="pg-regular no-focus placeholder placeholder:pg-regular border-none bg-transparent! shadow-none outline-none pointer-events-none"
          />
        </div>
      </section>

      <div className="mt-8 hidden sm:flex flex-wrap gap-3">
        {HomePageFilters.map((filter) => (
          <Button
            key={filter.label}
            className="body-medium rounded-md px-6 py-3 capitalize shadow-none bg-light800_dark300 text-light-500"
            disabled
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <PostCardsSkeleton className="mt-10" />
    </>
  );
};

export default HomeLoading;
