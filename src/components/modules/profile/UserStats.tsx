import StatsCard from "@/components/shared/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

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

      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-light900_dark300 light-border flex-center rounded-md border px-4 py-3 shadow-light100_dark200">
          <CardContent className="flex items-center justify-evenly gap-6 md:gap-4 lg:gap-6 max-xs:gap-16">
            <div className="flex flex-col gap-1">
              <p className="pg-semibold text-dark200_light900">
                {formatNumber(totalQuestions)}
              </p>
              <p className="small-semibold text-dark400_light700">
                {totalQuestions === 1 ? "Question" : "Questions"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="pg-semibold text-dark200_light900">
                {formatNumber(totalAnswers)}
              </p>
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
