import { AppSidebar } from "@/components/modules/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/modules/dashboard/site-header";
import { SectionCards } from "@/components/modules/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/modules/dashboard/chart-area-interactive";
import { PendingQuestions } from "@/components/modules/dashboard/pending-questions";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <PendingQuestions />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
