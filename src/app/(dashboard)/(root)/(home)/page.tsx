import { Button } from "@/components/ui/button";
import routes from "@/common/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/layout/main/LocalSearch";

const HomePage = () => {
  return (
    <>
      {/* Ask a question section */}
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-11 px-4 py-3 text-light-900! hover:primary-gradient-hover cursor-pointer"
          asChild
        >
          <Link href={routes.ask_question}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-10">
        <LocalSearch
          route="/"
          placeholder="Search a question here..."
          className="flex-1"
        />
      </section>
      HomeFilter
    </>
  );
};

export default HomePage;
