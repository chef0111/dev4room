import { Suspense } from "react";
import { ScrollToTop } from "@/components/modules/main/scroll-to-top";
import { ErrorBoundary } from "@/components/shared";
import { AppSidebar } from "@/components/modules/dashboard/app-sidebar";
import { SiteHeader } from "@/components/modules/dashboard/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <main className="bg-light850_dark100 relative">
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
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
                <ErrorBoundary>{children}</ErrorBoundary>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
};

export default DashboardLayout;
