import "@/lib/orpc.server";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { baseUrl } from "@/common/constants";
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
  metadataBase: new URL(baseUrl),
  title: {
    default: "Dev4Room",
    template: "%s | Dev4Room",
  },
  description:
    "Programming Q&A community, built for developers. Post, search, and filter programming questions. Find solutions, share knowledge, and grow together.",
  keywords: [
    "programming",
    "developer",
    "Q&A",
    "questions",
    "answers",
    "coding",
    "software development",
    "web development",
    "community",
  ],
  authors: [{ name: "Dev4Room" }],
  creator: "Dev4Room",
  publisher: "Dev4Room",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Dev4Room",
    title: "Dev4Room - Programming Q&A Community",
    description:
      "Programming Q&A community, built for developers. Post, search, and filter programming questions. Find solutions, share knowledge, and grow together.",
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Dev4Room - Programming Q&A Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev4Room - Programming Q&A Community",
    description:
      "Programming Q&A community, built for developers. Post, search, and filter programming questions. Find solutions, share knowledge, and grow together.",
    creator: "@dev4room",
    images: [`${baseUrl}/images/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "fb:app_id": process.env.FACEBOOK_APP_ID || "",
  },
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Dev4Room",
                url: baseUrl,
                logo: `${baseUrl}/images/brand.png`,
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Dev4Room",
                url: baseUrl,
                description:
                  "Post, search, and filter programming questions from the Dev4Room community. Find solutions, share knowledge, and ask your own questions.",
                publisher: {
                  "@type": "Organization",
                  name: "Dev4Room",
                  logo: {
                    "@type": "ImageObject",
                    url: `${baseUrl}/images/brand.png`,
                  },
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${baseUrl}/?query={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: [
                  {
                    "@type": "SiteNavigationElement",
                    position: 1,
                    name: "Home",
                    description: "Browse all programming questions",
                    url: baseUrl,
                  },
                  {
                    "@type": "SiteNavigationElement",
                    position: 2,
                    name: "Community",
                    description: "Find and connect with developers",
                    url: `${baseUrl}/community`,
                  },
                  {
                    "@type": "SiteNavigationElement",
                    position: 3,
                    name: "Tags",
                    description: "Explore topics by technology and language",
                    url: `${baseUrl}/tags`,
                  },
                  {
                    "@type": "SiteNavigationElement",
                    position: 4,
                    name: "Ask Question",
                    description: "Post your programming question",
                    url: `${baseUrl}/ask-question`,
                  },
                ],
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
