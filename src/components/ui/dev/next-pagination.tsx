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
} from "../pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Route } from "next";
import { useFilterTransition } from "@/context/filter-provider";

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
  pageSearchParam = "page",
  className,
  scroll = true,
}: NextPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useFilterTransition();

  const [_, setPage] = useQueryState(
    pageSearchParam,
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      scroll,
      throttleMs: 50,
    })
  );

  const totalPageCount = Math.max(1, Math.ceil(totalCount / Number(pageSize)));

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam;
      if (!searchParams) return `${pathname}?${key}=${newPage}`;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, String(newPage));
      return `${pathname}?${newSearchParams.toString()}`;
    },
    [searchParams, pathname, pageSearchParam]
  );

  const handlePageChange = useCallback(
    (newPage: number, e: React.MouseEvent) => {
      e.preventDefault();
      startTransition(() => {
        setPage(newPage);
      });
    },
    [setPage, startTransition]
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
              onClick={(e) => handlePageChange(i, e)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={buildLink(1) as Route}
            isActive={Number(page) === 1}
            scroll={scroll}
            onClick={(e) => handlePageChange(1, e)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (Number(page) > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
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
              onClick={(e) => handlePageChange(i, e)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (Number(page) < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            href={buildLink(totalPageCount) as Route}
            isActive={Number(page) === totalPageCount}
            scroll={scroll}
            onClick={(e) => handlePageChange(totalPageCount, e)}
          >
            {String(totalPageCount)}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div
      className={cn(
        "w-full gap-2",
        totalCount > Number(pageSize) ? "flex-center" : "hidden",
        className
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
              onClick={(e) =>
                handlePageChange(Math.max(Number(page) - 1, 1), e)
              }
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
              onClick={(e) =>
                handlePageChange(Math.min(Number(page) + 1, totalPageCount), e)
              }
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
