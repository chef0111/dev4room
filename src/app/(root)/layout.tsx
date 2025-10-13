import { Suspense } from "react";
import TopProgress from "@/components/ui/top-progress";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Suspense fallback={null}>
        <TopProgress />
      </Suspense>
      {children}
    </div>
  );
};

export default DashboardLayout;
