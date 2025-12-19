import RightSidebar from "@/components/navigation/right-sidebar";
import { ErrorBoundary } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <>
      <ErrorBoundary>
        <div className="xl:pr-74">{children}</div>
      </ErrorBoundary>
      <RightSidebar />
    </>
  );
};

export default HomeLayout;
