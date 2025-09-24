import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <>
      <section className="flex flex-col-reverse sm:flex-row justify-between sm:items-center w-full gap-4">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-10 px-4 py-3 text-light-900! hover:primary-gradient-hover cursor-pointer"
          asChild
        >
          <Link href="#">Ask Question</Link>
        </Button>
      </section>
      <section className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center"></section>
    </>
  );
};

export default HomePage;
