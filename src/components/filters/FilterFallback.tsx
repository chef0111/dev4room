import { cn } from "@/lib/utils";
import { ChevronDown, ListFilter } from "lucide-react";

const FilterFallback = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-center light-border rounded-md bg-light800_dark300 text-muted-foreground px-3 py-2 h-12 min-w-fit",
        className,
      )}
    >
      <div className="flex-between gap-2 sm:min-w-fit w-full">
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
