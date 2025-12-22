import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconClock, IconCircleCheck } from "@tabler/icons-react";

const WaitlistEmpty = () => {
  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClock className="size-5" />
          Pending Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
          <IconCircleCheck className="mb-2 size-16" />
          <p className="text-lg font-medium">All caught up!</p>
          <p className="text-sm">No pending questions to review.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitlistEmpty;
