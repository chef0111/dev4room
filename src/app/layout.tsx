import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const esbuild = localFont({
  src: "../../public/fonts/ESBuild.otf",
  variable: "--font-esbuild",
  weight: "400 500 600 700",
});

export const metadata: Metadata = {
  title: "Dev4Room",
  description: "Programming Q&A community, built for developers.",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${esbuild.variable} antialiased bg-light850_dark100 custom-scrollbar`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
