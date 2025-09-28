import TopProgress from "@/components/ui/top-progress";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <TopProgress />
      {children}
    </div>
  );
};

export default DashboardLayout;
