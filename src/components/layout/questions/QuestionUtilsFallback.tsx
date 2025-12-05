import { Button } from "@/components/ui/button";
import { TbArrowBigDown, TbArrowBigUp, TbBookmark } from "react-icons/tb";

const QuestionUtilsFallback = () => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-center bg-light700_dark400 rounded-md gap-1 p-1.5"
        role="status"
      >
        <Button
          variant="ghost"
          className="h-5 w-5 bg-transparent!"
          disabled
          aria-label="Upvote"
        >
          <TbArrowBigUp className="size-5 text-light-400 dark:text-light-500" />
        </Button>
      </div>

      <div className="flex-center bg-light700_dark400 rounded-md p-1.5">
        <Button
          variant="ghost"
          className="h-5 w-5 bg-transparent!"
          disabled
          aria-label="Downvote"
        >
          <TbArrowBigDown className="size-5 text-light-400 dark:text-light-500" />
        </Button>
      </div>

      <Button
        variant="ghost"
        className="size-7.5 hover:bg-transparent"
        aria-label="Save Question"
        disabled
      >
        <TbBookmark className="text-light-400 dark:text-light-500 size-5" />
      </Button>
    </div>
  );
};

export default QuestionUtilsFallback;
