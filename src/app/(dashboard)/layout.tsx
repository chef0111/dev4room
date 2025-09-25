interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default DashboardLayout;
