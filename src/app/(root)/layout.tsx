import LeftSidebar from "@/components/layout/navigation/LeftSidebar";
import Navbar from "@/components/layout/navigation/navbar";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="bg-light850_dark100 relative">
      <NextTopLoader showSpinner={false} />
      
      {/* Navbar wrapped in Suspense for dynamic session data */}
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>

      <div className="block">
        {/* LeftSidebar wrapped in Suspense for dynamic session data */}
        <Suspense fallback={<LeftSidebarSkeleton />}>
          <LeftSidebar />
        </Suspense>

        <section className="flex min-h-screen flex-1 flex-col min-w-full px-6 pb-6 pt-32 max-md:pb-14 sm:px-14 sm:pl-34 lg:pl-78 2xl:px-0">
          <div className="mx-auto w-full">
            <Suspense fallback={<PageContentSkeleton />}>
              {children}
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
};

function NavbarSkeleton() {
  return (
    <nav className="flex-between bg-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12">
      <div className="flex-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-6 w-24 max-sm:hidden" />
      </div>
      <Skeleton className="flex-1 h-10 mx-4" />
      <div className="flex-between gap-5">
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    </nav>
  );
}

function LeftSidebarSkeleton() {
  return (
    <div className="bg-light900_dark200 light-border fixed left-0 top-0 h-screen lg:w-65 flex flex-col justify-between border-r p-4 pt-32 shadow-light-300 dark:shadow-none max-sm:hidden">
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

function PageContentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default DashboardLayout;
