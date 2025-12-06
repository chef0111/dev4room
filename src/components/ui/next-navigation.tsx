"use client";

import { type ReactNode, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Route } from "next";

export interface NextPaginationProps {
  totalCount: number;
  pageSize?: number | string | undefined;
  page?: number | string | undefined;
  pageSearchParam?: string;
  className?: string;
  scroll?: boolean;
}

export function NextPagination({
  pageSize = 10,
  totalCount,
  page = 1,
  pageSearchParam,
  className,
  scroll = true,
}: NextPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPageCount = Math.max(1, Math.ceil(totalCount / Number(pageSize)));

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      if (!searchParams) return `${pathname}?${key}=${newPage}`;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, String(newPage));
      return `${pathname}?${newSearchParams.toString()}`;
    },
    [searchParams, pathname, pageSearchParam],
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={buildLink(i) as Route}
              isActive={Number(page) === i}
              scroll={scroll}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={buildLink(1) as Route}
            isActive={Number(page) === 1}
            scroll={scroll}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (Number(page) > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, Number(page) - 1);
      const end = Math.min(totalPageCount - 1, Number(page) + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={buildLink(i) as Route}
              isActive={Number(page) === i}
              scroll={scroll}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (Number(page) < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            href={buildLink(totalPageCount) as Route}
            isActive={Number(page) === totalPageCount}
            scroll={scroll}
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div
      className={cn(
        "gap-2 w-full",
        totalCount > Number(pageSize) ? "flex-center" : "hidden",
        className,
      )}
    >
      <Pagination>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              href={buildLink(Math.max(Number(page) - 1, 1)) as Route}
              aria-disabled={Number(page) === 1}
              tabIndex={Number(page) === 1 ? -1 : undefined}
              scroll={scroll}
              className={
                Number(page) === 1
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href={
                buildLink(Math.min(Number(page) + 1, totalPageCount)) as Route
              }
              aria-disabled={Number(page) === totalPageCount}
              tabIndex={Number(page) === totalPageCount ? -1 : undefined}
              scroll={scroll}
              className={
                Number(page) === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
