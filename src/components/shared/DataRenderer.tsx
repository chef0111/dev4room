import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import { Button } from "../ui/button";
import {
  DEFAULT_EMPTY,
  DEFAULT_ERROR,
  EMPTY_IMAGE,
  ERROR_IMAGE,
} from "@/common/constants/states";

interface DataRendererProps<T> {
  success: boolean;
  error?: {
    message?: string;
    details?: Record<string, string[]>;
  };
  data?: T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
    button?: {
      label: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

interface SkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message?: string;
  button?: {
    label: string;
    href: string;
  };
  onClick?: () => void;
}

export const SkateSkeleton = memo(
  ({ image, title, message, button, onClick }: SkeletonProps) => (
    <div className="flex-center flex-col mt-16 w-full">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          width={270}
          height={200}
          className="hidden object-contain dark:block"
        />
        <Image
          src={image.light}
          alt={image.alt}
          width={270}
          height={200}
          className="block object-contain dark:hidden"
        />
      </>
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      {message && (
        <p className="body-regular text-dar500_light700 my-3 max-w-md text-center">
          {message}
        </p>
      )}

      {button && (
        <Link href={button.href}>
          <Button
            className="pg-medium mt-5 min-h-10 round-lg bg-primary-500 text-light-900 hover:bg-link-100 cursor-pointer"
            onClick={onClick}
          >
            {button.label}
          </Button>
        </Link>
      )}
    </div>
  )
);

SkateSkeleton.displayName = "SkateSkeleton";

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  const errorMessage = useMemo(() => {
    if (!error) return DEFAULT_ERROR.message;
    return error.details
      ? JSON.stringify(error.details, null, 2)
      : DEFAULT_ERROR.message;
  }, [error]);

  if (!success) {
    return (
      <SkateSkeleton
        image={ERROR_IMAGE}
        title={error?.message || DEFAULT_ERROR.title}
        message={errorMessage}
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <SkateSkeleton
        image={EMPTY_IMAGE}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <div>{render(data)}</div>;
};

export default DataRenderer;
