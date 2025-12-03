import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTechDescription, getTechIcon } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DevCard from "@/components/ui/dev-card";

interface TagCardProps {
  id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
  remove?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  id,
  name,
  questions,
  showCount,
  compact = false,
  isButton,
  remove,
  handleRemove,
}: TagCardProps) => {
  const techIcon = getTechIcon(name);
  const techDescription = getTechDescription(name);

  const TagContent = (
    <>
      <Badge className="flex gap-2 subtle-medium bg-light800_dark300 text-light400_light500 rounded-md px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <Image
            src={`${techIcon}`}
            alt={`${name} icon`}
            width={14}
            height={14}
            aria-hidden="true"
          />
          <span>{name}</span>
        </div>

        {remove && (
          <label
            className="flex-center subtle-medium text-dark400_light800 bg-transparent hover:bg-transparent no-focus h-0 px-0 cursor-pointer"
            onClick={handleRemove}
          >
            ✕
          </label>
        )}
      </Badge>

      {showCount && (
        <p className="body-medium text-dark500_light700">{`${questions}+`}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <Button
        type="button"
        className="flex justify-between gap-2 bg-transparent! p-0! size-fit!"
      >
        {TagContent}
      </Button>
    ) : (
      <Link href={`/tags/${id}`} className="flex-between gap-2">
        {TagContent}
      </Link>
    );
  }

  return (
    <Link href={`/tags/${id}`}>
      <DevCard>
        <div className="flex-between gap-3 w-full">
          <div className="bg-light800_dark400 w-fit rounded-sm text-center px-3 py-1.5">
            <p className="pg-semibold text-dark300_light900">
              {name.toLowerCase()}
            </p>
          </div>
          <Image
            src={`${techIcon}`}
            alt={`${name} icon`}
            width={24}
            height={24}
          />
        </div>

        <p className="small-regular text-dark500_light700 mt-4 line-clamp-3">
          {techDescription}
        </p>

        <p className="small-medium text-dark400_light500 mt-4 w-full">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions}+
          </span>
          Questions
        </p>
      </DevCard>
    </Link>
  );
};

export default TagCard;
