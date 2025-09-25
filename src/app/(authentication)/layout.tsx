import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="flex-center flex-col min-h-screen bg-auth-light bg-cover bg-center bg-no-repeat bg-fixed px-4 py-10 dark:bg-auth-dark">
      <Link href="/" className="flex-center pb-4 gap-3">
        <Image
          src="/images/brand.svg"
          width={50}
          height={50}
          alt="DevFlow logo"
          className="max-sm:w-10 max-sm:h-10"
        />
        <p className="h1-bold text-5xl max-sm:text-4xl font-esbuild text-dark100_light900">
          Dev<span className="text-primary-500">4Room</span>
        </p>
      </Link>
      <Card className="light-border bg-light800_dark200 shadow-light100_dark100 min-w-full rounded-xl border px-2 sm:px-4 py-10 shadow-md sm:min-w-[520px]">
        <CardHeader className="flex-center text-center">
          <div className="space-y-1">
            <h1 className="md:h2-bold h3-bold text-dark100_light900">
              Join Dev4Room
            </h1>
            <p className="md:paragraph-regular body-regular text-dark500_light400">
              To connect with developers around the world
            </p>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
};

export default AuthLayout;
