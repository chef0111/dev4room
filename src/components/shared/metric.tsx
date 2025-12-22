import { cn } from "@/lib/utils";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

interface MetricsProps {
  href?: Route;
  imgUrl: string;
  alt: string;
  value: number | string;
  title: string;
  textStyles?: string;
  imgStyles?: string;
  titleStyles?: string;
}

const Metric = ({
  href,
  imgUrl,
  alt,
  value,
  title,
  textStyles,
  imgStyles,
  titleStyles,
}: MetricsProps) => {
  const avatar = imgUrl || "/images/brand.svg";
  const content = (
    <div className="flex items-center gap-1">
      <Image
        src={avatar}
        alt={alt}
        width={16}
        height={16}
        className={`rounded-full object-contain ${imgStyles}`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        {title ? (
          <span className={cn("small-regular line-clamp-1", titleStyles)}>
            {title}
          </span>
        ) : null}
      </p>
    </div>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {content}
    </Link>
  ) : (
    <div className="flex-center gap-1">{content}</div>
  );
};

export default Metric;
