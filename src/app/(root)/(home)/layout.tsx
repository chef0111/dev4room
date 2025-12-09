import RightSidebar from "@/components/navigation/right-sidebar/RightSidebar";

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
