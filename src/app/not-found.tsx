import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function NotFound() {
  return (
    <main className="bg-light850_dark100 flex min-h-screen items-center justify-center">
      <ErrorFallback
        title="Page Not Found"
        message="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
        showHomeButton
        showBackButton
      />
    </main>
  );
}
