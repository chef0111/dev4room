import { SectionCards } from "@/components/modules/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/modules/dashboard/chart-area-interactive";
import { PendingQuestions } from "@/components/modules/dashboard/pending-questions";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <PendingQuestions />
    </>
  );
}
