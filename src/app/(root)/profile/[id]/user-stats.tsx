import StatsCard from "@/components/modules/profile/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface UserStatsProps {
  totalQuestions: number;
  totalAnswers: number;
  badges: Badges;
  reputationPoints: number;
}

const UserStats = ({
  totalQuestions,
  totalAnswers,
  badges,
  reputationPoints,
}: UserStatsProps) => {
  return (
    <div className="mt-4">
      <h3 className="h3-semibold text-dark200_light900">
        Stats{" "}
        <span className="small-semibold primary-text-gradient">
          {formatNumber(reputationPoints)}
        </span>
      </h3>

      <div className="xs:grid-cols-2 mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="bg-light900_dark300 light-border flex-center shadow-light100_dark200 rounded-md border px-4 py-3">
          <CardContent className="max-xs:gap-16 flex items-center justify-evenly gap-6 md:gap-4 lg:gap-6">
            <div className="flex flex-col gap-1">
              <NumberFlow
                value={totalQuestions}
                format={{ notation: "compact" }}
                className="pg-semibold text-dark200_light900"
              />
              <p className="small-semibold text-dark400_light700">
                {totalQuestions === 1 ? "Question" : "Questions"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <NumberFlow
                value={totalAnswers}
                format={{ notation: "compact" }}
                className="pg-semibold text-dark200_light900"
              />
              <p className="small-semibold text-dark400_light700">
                {totalAnswers === 1 ? "Answer" : "Answers"}
              </p>
            </div>
          </CardContent>
        </Card>

        <StatsCard
          badge="/icons/gold-medal.svg"
          value={badges.GOLD}
          title={`Gold ${badges.GOLD === 1 ? "Badge" : "Badges"}`}
        />
        <StatsCard
          badge="/icons/silver-medal.svg"
          value={badges.SILVER}
          title={`Silver ${badges.SILVER === 1 ? "Badge" : "Badges"}`}
        />
        <StatsCard
          badge="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title={`Bronze ${badges.BRONZE === 1 ? "Badge" : "Badges"}`}
        />
      </div>
    </div>
  );
};

export default UserStats;
