import { Skeleton } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconClock } from "@tabler/icons-react";

const WaitlistFallback = () => {
  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClock className="size-5" />
          Pending Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitlistFallback;
