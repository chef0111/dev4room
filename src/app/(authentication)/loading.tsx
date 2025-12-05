import Loader from "@/components/ui/loader";
import { Suspense } from "react";

const Loading = () => {
  return (
    <div className="flex-center h-screen w-screen">
      <Suspense fallback={null}>
        <Loader />
      </Suspense>
    </div>
  );
};

export default Loading;
