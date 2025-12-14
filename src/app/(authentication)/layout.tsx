import { Card, CardContent } from "@/components/ui";
import { TextShimmer } from "@/components/ui/dev";
import { Brand } from "@/components/ui/dev";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <main
      className="flex-center bg-auth-light dark:bg-auth-dark min-h-screen flex-col bg-cover bg-fixed bg-center bg-no-repeat px-4 py-10"
      data-no-scrollbar="true"
    >
      <Brand
        href="/"
        size={48}
        className="gap-3 pb-4"
        textClassName="h1-bold text-5xl max-sm:text-4xl font-esbuild text-dark100_light900"
      />
      <Card className="bg-light900_dark200 light-border shadow-light100_dark100 min-w-full rounded-xl border px-2 shadow-md sm:min-w-fit sm:px-4">
        <CardContent>
          <Suspense
            fallback={<TextShimmer duration={1}>Loading...</TextShimmer>}
          >
            {children}
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthLayout;
