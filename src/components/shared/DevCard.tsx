import { Card, CardContent } from "@/components/ui/card";

const DevCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full rounded-2xl p-px border-gradient">
      <Card className="shadow-light100_darknone bg-light900_dark200 rounded-2xl p-4">
        <CardContent className="flex-center flex-col px-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevCard;
