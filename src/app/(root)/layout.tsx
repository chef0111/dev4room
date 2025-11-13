import NextTopLoader from "nextjs-toploader";
interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NextTopLoader showSpinner={false} />
      {children}
    </>
  );
};

export default DashboardLayout;
