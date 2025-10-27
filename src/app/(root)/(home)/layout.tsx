import Navbar from "@/components/layout/navigation/navbar";
import LeftSidebar from "@/components/layout/navigation/LeftSidebar";
import RightSidebar from "@/components/layout/navigation/RightSidebar";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <main className="bg-light850_dark100 relative">
      <Navbar />

      <div className="block">
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col min-w-full px-6 pb-6 pt-32 max-md:pb-14 sm:px-14 sm:pl-36 lg:pl-80 xl:pr-88">
          <div className="mx-auto w-full">{children}</div>
        </section>

        <RightSidebar />
      </div>
    </main>
  );
};

export default HomeLayout;
