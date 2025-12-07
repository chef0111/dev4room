import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/layout/navigation/navbar";
import { Skeleton } from "@/components/ui";
import LeftSidebar from "@/components/layout/navigation/left-sidebar/LeftSidebar";
import NavTabsFallback from "@/components/layout/navigation/left-sidebar/NavTabsFallback";
import { ScrollToTop } from "@/components/layout/main/ScrollToTop";
import { Props } from "next/script";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <main className="bg-light850_dark100 relative">
      <NextTopLoader showSpinner={false} />

      <Navbar className="z-50" />

      <div className="block">
        <Suspense fallback={<LeftSidebarSkeleton />}>
          <LeftSidebar />
        </Suspense>

        <section className="flex min-h-screen flex-1 flex-col min-w-full px-6 pb-6 pt-32 max-md:pb-14 sm:px-14 sm:pl-34 lg:pl-78 2xl:px-0">
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

function LeftSidebarSkeleton() {
  return (
    <div className="bg-light900_dark200 light-border fixed left-0 top-0 h-screen lg:w-65 flex flex-col justify-between border-r p-4 pt-32 shadow-light-300 dark:shadow-none max-sm:hidden">
      <NavTabsFallback isMobile={false} />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

export default DashboardLayout;
