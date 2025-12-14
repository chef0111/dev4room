import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/navigation/navbar";
import { ScrollToTop } from "@/components/modules/main/ScrollToTop";
import LeftSidebar from "@/components/navigation/left-sidebar";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <main className="bg-light850_dark100 relative">
      <NextTopLoader showSpinner={false} />

      <Navbar className="z-50" />

      <div className="block">
        <LeftSidebar />

        <section className="flex min-h-screen min-w-full flex-1 flex-col px-6 pt-32 pb-6 max-md:pb-14 sm:px-14 sm:pl-34 lg:pl-78 2xl:px-0">
          <div className="mx-auto w-full">
            <Suspense fallback={null}>
              <ScrollToTop />
            </Suspense>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardLayout;
