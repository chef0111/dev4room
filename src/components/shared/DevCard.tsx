import { Card, CardContent } from "@/components/ui/card";

const DevCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full rounded-2xl p-[0.1rem] border-gradient z-0">
      <Card className="dev-card">
        <CardContent className="flex-center flex-col px-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevCard;
