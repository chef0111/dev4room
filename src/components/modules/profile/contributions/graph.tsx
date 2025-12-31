"use client";

import { useContribution } from "@/queries/user.queries";
import {
  ContributionGraph,
  ContributionGraphCalendar,
  ContributionGraphBlock,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
  ContributionGraphLegend,
} from "@/components/ui/contribution-graph";
import { useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ContributionActivity } from "@/app/server/user/user.dto";
import { ContributionGraphSkeleton } from "@/components/skeletons";
interface ContributionGraphDisplayProps {
  userId: string;
  year: number;
}

const ContributionGraphDisplay = ({
  userId,
  year,
}: ContributionGraphDisplayProps) => {
  const { data, isLoading, error } = useContribution(userId, year);

  const processedData = useMemo(() => {
    if (!data?.timestamps) return null;

    // Group by local date string (YYYY-MM-DD)
    const countsMap = new Map<string, number>();
    for (const ts of data.timestamps) {
      const date = new Date(ts);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      countsMap.set(dateStr, (countsMap.get(dateStr) ?? 0) + 1);
    }

    const counts = Array.from(countsMap.values());
    const maxCount = Math.max(...counts, 0);

    const calculateLevel = (count: number): number => {
      if (count === 0) return 0;
      const ratio = count / maxCount;
      if (ratio <= 0.25) return 1;
      if (ratio <= 0.5) return 2;
      if (ratio <= 0.75) return 3;
      return 4;
    };

    const contributions: ContributionActivity[] = [];

    // Generate full year range
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const count = countsMap.get(dateStr) ?? 0;
        contributions.push({
          date: dateStr,
          count,
          level: calculateLevel(count),
        });
      }
    }

    return { contributions, totalCount: data.totalCount };
  }, [data, year]);

  if (isLoading && !data) {
    return <ContributionGraphSkeleton />;
  }

  if (error || !processedData) {
    return (
      <div className="text-muted-foreground text-sm">
        Failed to load contributions
      </div>
    );
  }

  const { contributions, totalCount } = processedData;

  const formatTooltipDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return format(new Date(y, m - 1, d), "MMMM do");
  };

  return (
    <ContributionGraph data={contributions} totalCount={totalCount}>
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <ContributionGraphBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
                className={cn(
                  'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                  'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                  'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                  'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                  'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              {activity.count} contribution{activity.count !== 1 ? "s" : ""} on{" "}
              {formatTooltipDate(activity.date)}.
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphTotalCount>
          {({ totalCount }) => (
            <span className="text-muted-foreground">
              {totalCount} contributions in {year}
            </span>
          )}
        </ContributionGraphTotalCount>
        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
};

export default ContributionGraphDisplay;
