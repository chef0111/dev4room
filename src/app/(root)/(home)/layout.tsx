import dynamic from "next/dynamic";

const RightSidebar = dynamic(
  () => import("@/components/navigation/right-sidebar/RightSidebar"),
  { ssr: true }
);

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
