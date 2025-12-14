import { Brand } from "@/components/ui/dev";

const Loading = () => {
  return (
    <div className="flex-center min-h-screen w-screen overflow-hidden">
      <Brand href={null} size={64} textClassName="h1-bold text-5xl" />
    </div>
  );
};

export default Loading;
