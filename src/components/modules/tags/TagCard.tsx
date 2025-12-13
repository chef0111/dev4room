import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { DevCard } from "@/components/ui/dev";
import { getTechDescription, getTechIcon } from "@/lib/utils";
import Image from "next/image";

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
      <Badge className="subtle-medium bg-light800_dark300 text-light400_light500 flex gap-2 rounded-md px-4 py-2 uppercase">
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
            className="flex-center subtle-medium text-dark400_light800 no-focus h-0 cursor-pointer bg-transparent px-0 hover:bg-transparent"
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
        className="flex size-fit! justify-between gap-2 bg-transparent! p-0!"
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
        <div className="flex-between w-full gap-3">
          <div className="bg-light800_dark400 w-fit rounded-sm px-3 py-1.5 text-center">
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
