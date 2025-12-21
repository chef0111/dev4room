import RightSidebar from "@/components/navigation/right-sidebar";
import { ErrorBoundary } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <>
      <div className="xl:pr-74">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
      <RightSidebar />
    </>
  );
};

export default HomeLayout;
