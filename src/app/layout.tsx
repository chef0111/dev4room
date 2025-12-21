import "@/lib/orpc.server";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui";
import { Providers } from "./providers";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const esbuild = localFont({
  src: "../../public/fonts/ESBuild.otf",
  variable: "--font-esbuild",
  weight: "400 500 600 700",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Dev4Room",
  description: "Programming Q&A community, built for developers.",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body
        className={`${inter.variable} ${esbuild.variable} bg-light850_dark100 antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
          <Toaster richColors />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
