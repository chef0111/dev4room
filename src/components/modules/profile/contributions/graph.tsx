"use client";

import { useContribution } from "@/queries/user.queries";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/contribution-graph";
import { cn } from "@/lib/utils";
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

  if (isLoading && !data) {
    return <ContributionGraphSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="text-muted-foreground text-sm">
        Failed to load contributions
      </div>
    );
  }

  const { contributions, totalCount } = data;

  if (contributions.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No contributions this year
      </div>
    );
  }

  return (
    <ContributionGraph data={contributions} totalCount={totalCount}>
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
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
