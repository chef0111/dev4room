import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { cn } from "@/lib/utils";

interface BrandProps {
  href?: Route | null;
  showText?: boolean;
  size?: number;
  className?: string;
  textClassName?: string;
}

export function Brand({
  href = "/",
  showText = true,
  size = 23,
  className,
  textClassName,
}: BrandProps) {
  const content = (
    <div className={cn("flex-center gap-2", className)}>
      <Image
        src="/images/brand.svg"
        width={size}
        height={size}
        alt="Dev4Room logo"
      />
      {showText && (
        <p
          className={cn(
            "h2-bold font-esbuild text-dark100_light900 max-sm:hidden",
            textClassName
          )}
        >
          Dev<span className="text-primary-500">4Room</span>
        </p>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="flex-center">
      {content}
    </Link>
  );
}
