import "@/lib/orpc.server";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://dev4room.pro/" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Dev4Room",
                url: "https://dev4room.pro",
                logo: "https://dev4room.pro/images/brand.png",
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Dev4Room",
                url: "https://dev4room.pro",
                description:
                  "Post, search, and filter programming questions from the Dev4Room community. Find solutions, share knowledge, and ask your own questions.",
                publisher: {
                  "@type": "Organization",
                  name: "Dev4Room",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://dev4room.pro/images/brand.png",
                  },
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://dev4room.pro/?query={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${esbuild.variable} bg-light900_dark200 antialiased`}
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
