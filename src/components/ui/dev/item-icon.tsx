import { cn } from "@/lib/utils";

export function ItemIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-muted-foreground/15 bg-muted ring-edge ring-offset-background flex size-6 shrink-0 items-center justify-center rounded-md border ring-1 ring-offset-1",
        "[&_svg]:text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
