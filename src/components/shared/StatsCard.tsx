import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  badge: string;
  value: number;
  title: string;
}

const StatsCard = ({ badge, value, title }: StatsCardProps) => {
  return (
    <Card className="bg-light900_dark300 flex items-start rounded-md light-border border px-4 py-3 shadow-light100_dark200">
      <CardContent
        className="flex-start flex-row gap-4 px-0"
        aria-label="User's Badge"
      >
        <Image src={badge} alt={title} width={40} height={50} />
        <div className="flex flex-col gap-1">
          <p className="pg-semibold text-dark200_light900">{value}</p>
          <p
            className="body-semibold text-dark300_light700 line-clamp-1"
            aria-label={title}
          >
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
