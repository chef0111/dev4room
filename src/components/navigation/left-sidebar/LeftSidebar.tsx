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
        className="no-scrollbar bg-light900_dark200 light-border shadow-light-300 fixed top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-4 pt-32 max-sm:hidden lg:w-65 dark:shadow-none"
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
