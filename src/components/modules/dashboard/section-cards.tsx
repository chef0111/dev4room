"use client";

import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus,
} from "@tabler/icons-react";
import { useAdminStats } from "@/queries/admin";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NumberFlow from "@number-flow/react";

export function SectionCards() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return <SectionCardsSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Failed to load statistics. Make sure you have admin access.
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      growth: stats.growthRates.usersGrowth,
      todayLabel: "New today",
      todayValue: stats.todayStats.newUsers,
    },
    {
      title: "Total Questions",
      value: stats.totalQuestions,
      growth: stats.growthRates.questionsGrowth,
      todayLabel: "Posted today",
      todayValue: stats.todayStats.newQuestions,
    },
    {
      title: "Total Answers",
      value: stats.totalAnswers,
      growth: stats.growthRates.answersGrowth,
      todayLabel: "Posted today",
      todayValue: stats.todayStats.newAnswers,
    },
    {
      title: "Total Tags",
      value: stats.totalTags,
      todayLabel: "Interactions today",
      todayValue: stats.todayStats.totalInteractions,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => {
        const hasGrowth = card.growth !== undefined;
        const isPositive = hasGrowth && card.growth > 0;
        const isNeutral = hasGrowth && card.growth === 0;
        const TrendIcon = isNeutral
          ? IconMinus
          : isPositive
            ? IconTrendingUp
            : IconTrendingDown;

        return (
          <Card key={card.title} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <NumberFlow value={card.value} />
              </CardTitle>
              {hasGrowth && (
                <CardAction>
                  <Badge
                    variant="outline"
                    className={
                      isNeutral
                        ? ""
                        : isPositive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                    }
                  >
                    <TrendIcon className="size-4" />
                    {isNeutral
                      ? "0%"
                      : `${card.growth > 0 ? "+" : ""}${card.growth.toFixed(1)}%`}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {hasGrowth && (
                  <>
                    {isNeutral
                      ? "No change this week"
                      : isPositive
                        ? "Trending up this week"
                        : "Trending down this week"}
                    <TrendIcon className="size-4" />
                  </>
                )}
                {!hasGrowth && (
                  <>
                    Platform engagement <IconTrendingUp className="size-4" />
                  </>
                )}
              </div>
              <div className="text-muted-foreground">
                {card.todayLabel}: {card.todayValue}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
