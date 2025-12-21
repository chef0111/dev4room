import { Suspense } from "react";
import { ScrollToTop } from "@/components/modules/main/ScrollToTop";
import { ErrorBoundary } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <main className="bg-light850_dark100 relative">
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <ErrorBoundary>{children}</ErrorBoundary>
    </main>
  );
};

export default DashboardLayout;
