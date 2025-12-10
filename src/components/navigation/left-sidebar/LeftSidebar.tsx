import { Suspense } from "react";
import NavTabs from "./NavTabs";
import NavTabsFallback from "./NavTabsFallback";
import SidebarUser from "./SidebarUser";
import { Skeleton } from "@/components/ui";

const LeftSidebar = () => {
  return (
    <div>
      <section
        role="navigation"
        aria-label="Primary"
        className="no-scrollbar bg-light900_dark200 light-border fixed left-0 top-0 h-screen lg:w-65 flex flex-col justify-between border-r p-4 pt-32 shadow-light-300 dark:shadow-none overflow-y-auto max-sm:hidden"
      >
        <div>
          <Suspense fallback={<NavTabsFallback isMobile={false} />}>
            <NavTabs isMobile={false} />
          </Suspense>
        </div>

        <Suspense fallback={<Skeleton className="h-12 w-full rounded-lg" />}>
          <SidebarUser />
        </Suspense>
      </section>
    </div>
  );
};

export default LeftSidebar;
