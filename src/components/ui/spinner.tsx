import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 border-[3px] border-secondary border-t-foreground/50 dark:border-t-foreground/80 rounded-full animate-spin",
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
