import LeftSidebar from "@/components/layout/navigation/LeftSidebar";
import Navbar from "@/components/layout/navigation/navbar";
import NextTopLoader from "nextjs-toploader";
interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="bg-light850_dark100 relative">
      <NextTopLoader showSpinner={false} />
      <Navbar />

      <div className="block">
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col min-w-full px-6 pb-6 pt-32 max-md:pb-14 sm:px-14 sm:pl-34 lg:pl-78 2xl:px-0">
          <div className="mx-auto w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default DashboardLayout;
