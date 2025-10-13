import { Suspense } from "react";
import Navbar from "@/components/layout/navigation/navbar";
import LeftSidebar from "@/components/layout/navigation/LeftSidebar";
import TopProgress from "@/components/ui/top-progress";

interface Props {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: Props) => {
  return (
    <main className="bg-light850_dark100 relative transition-all duration-200">
      <Suspense fallback={null}>
        <TopProgress />
      </Suspense>

      <Navbar />

      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col w-full px-6 pb-6 pt-32 max-md:pb-14 sm:px-14 2xl:px-0">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default ProfileLayout;
