import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TextShimmer from "@/components/ui/text-shimmer";

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a public Question</h1>

      <div className="w-full mt-8">
        <section className="flex flex-col gap-[29px]">
          <div className="flex flex-col w-full gap-3">
            <Label
              htmlFor="question-title"
              className="pg-semibold leading-snug"
            >
              Question Title
              <span className="text-red-500">*</span>
            </Label>
            <Input
              className="base-input placeholder:text-dark300_light800"
              placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
            />
            <Label className="body-regular! text-light-500 pt-px">
              Be specific and imagine you&apos;re asking a question to another
              person.
            </Label>
          </div>

          <div className="flex flex-col w-full gap-3">
            <Label
              htmlFor="question-content"
              className="pg-semibold leading-4.5!"
            >
              Detailed explanation of your problem
              <span className="text-red-500">*</span>
            </Label>

            <div className="md-editor-fallback">
              <TextShimmer duration={0.75}>Loading editor...</TextShimmer>
            </div>

            <Label className="body-regular! text-light-500 pt-px">
              Introduce the problem and expand on what you put in the title.
              Minimum 20 characters.
            </Label>
          </div>

          <div className="flex flex-col w-full gap-3">
            <Label className="pg-semibold leading-snug">
              Tags
              <span className="text-red-500">*</span>
            </Label>
            <Input
              className="base-input placeholder:text-dark300_light800"
              placeholder="Add tags..."
            />

            <Label className="body-regular! text-light-500 pt-px">
              Add up to 5 tags to describe what your question is about. Start
              typing to see suggestions.
            </Label>
          </div>

          <div className="my-6 flex justify-end">
            <Button
              type="button"
              disabled
              className="primary-gradient hover:primary-gradient-hover text-light-900! cursor-pointer"
            >
              Ask Question
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Loading;
