import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui";
import { TextShimmer } from "@/components/ui/dev";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <main
      className="flex-center flex-col min-h-screen bg-auth-light bg-cover bg-center bg-no-repeat bg-fixed px-4 py-10 dark:bg-auth-dark"
      data-no-scrollbar="true"
    >
      <Link href="/" className="flex-center pb-4 gap-3">
        <Image
          src="/images/brand.svg"
          width={48}
          height={48}
          alt="DevFlow logo"
          className="max-sm:w-10 max-sm:h-10"
        />
        <p className="h1-bold text-5xl max-sm:text-4xl font-esbuild text-dark100_light900">
          Dev<span className="text-primary-500">4Room</span>
        </p>
      </Link>
      <Card className="bg-light900_dark200 light-border shadow-light100_dark100 min-w-full rounded-xl border px-2 sm:px-4 shadow-md sm:min-w-fit">
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
