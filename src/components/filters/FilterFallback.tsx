import { cn } from "@/lib/utils";
import { ChevronDown, ListFilter } from "lucide-react";

const FilterFallback = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "light-border bg-light800_dark300 text-muted-foreground flex h-12 min-w-fit items-center rounded-md px-3 py-2",
        className
      )}
    >
      <div className="flex-between w-full gap-2 sm:min-w-fit">
        <ListFilter size={16} className="min-w-fit" />
        <span className="text-dark500_light700 body-regular min-w-fit grow text-left">
          Select a filter
        </span>
        <ChevronDown size={16} className="min-w-fit opacity-50" />
      </div>
    </div>
  );
};
export default FilterFallback;
