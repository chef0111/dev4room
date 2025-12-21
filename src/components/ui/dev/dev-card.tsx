import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DevCardProps {
  children: React.ReactNode;
  className?: string;
}

const DevCard = ({ children, className }: DevCardProps) => {
  return (
    <div className="border-gradient relative z-0 w-full rounded-2xl p-[0.1rem]">
      <Card className={cn("dev-card", className)}>
        <CardContent className="flex-center flex-col px-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevCard;
