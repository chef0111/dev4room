import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_EMPTY,
  DEFAULT_ERROR,
  EMPTY_IMAGE,
  ERROR_IMAGE,
} from "@/common/constants/states";
import { Route } from "next";

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

export const SkateSkeleton = ({
  image,
  title,
  message,
  button,
  onClick,
}: SkeletonProps) => (
  <div className="flex-center mt-16 w-full flex-col">
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
      <p className="body-regular text-dark500_light700 my-3 max-w-md text-center">
        {message}
      </p>
    )}

    {button && (
      <Link href={button.href as Route}>
        <Button
          className="pg-medium round-lg bg-primary-500 text-light-900 hover:bg-link-100 mt-5 min-h-10 cursor-pointer"
          onClick={onClick}
        >
          {button.label}
        </Button>
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  const errorMessage = error?.details
    ? JSON.stringify(error.details, null, 2)
    : DEFAULT_ERROR.message;

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
