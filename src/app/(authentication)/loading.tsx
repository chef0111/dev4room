import { Loader } from "@/components/ui";
import { Suspense } from "react";

const Loading = () => {
  return (
    <div className="flex-center min-h-screen min-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <Loader />
      </Suspense>
    </div>
  );
};

export default Loading;
