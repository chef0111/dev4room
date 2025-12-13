import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "border-secondary border-t-foreground/50 dark:border-t-foreground/80 size-4 animate-spin rounded-full border-[3px]",
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
