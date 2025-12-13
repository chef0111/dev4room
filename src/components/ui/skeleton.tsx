import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-light-800 dark:bg-dark-300 relative overflow-hidden rounded-md",
        "before:absolute before:inset-0 before:-translate-x-full",
        "ease before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent dark:before:via-white/10",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
