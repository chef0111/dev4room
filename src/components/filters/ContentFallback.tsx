import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { TextShimmer } from "@/components/ui/dev";

interface ContentFallbackProps {
  message?: string;
  className?: string;
}

const ContentFallback = ({
  message = "Loading content...",
  className,
}: ContentFallbackProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20",
        className,
      )}
    >
      <Spinner className="size-8" />
      <TextShimmer duration={1.5} className="text-lg">
        {message}
      </TextShimmer>
    </div>
  );
};

export default ContentFallback;
