import RightSidebar from "@/components/layout/navigation/RightSidebar";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <>
      <div className="xl:pr-74">{children}</div>
      <RightSidebar />
    </>
  );
};

export default HomeLayout;
