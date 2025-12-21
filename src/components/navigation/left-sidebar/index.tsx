import NavTabs from "./nav-tabs";
import SidebarUser from "./sidebar-user";

const LeftSidebar = () => {
  return (
    <div>
      <section
        role="navigation"
        aria-label="Primary"
        className="no-scrollbar bg-light900_dark200 light-border shadow-light-300 fixed top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-4 pt-32 max-sm:hidden lg:w-65 dark:shadow-none"
      >
        <div>
          <NavTabs isMobile={false} />
        </div>

        <SidebarUser />
      </section>
    </div>
  );
};

export default LeftSidebar;
