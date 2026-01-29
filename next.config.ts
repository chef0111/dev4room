import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    questions: { stale: 60, revalidate: 30, expire: 3600 },
    users: { stale: 120, revalidate: 60, expire: 3600 },
    default: { stale: 300, revalidate: 120, expire: 3600 },
  },
  typedRoutes: true,
  experimental: {
    typedEnv: true,
    authInterrupts: true,
    optimizeCss: true,
    staleTimes: {
      dynamic: 300,
      static: 3600,
    },
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "t3.storage.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            // max-age=0: check with server every time (browser)
            // s-maxage=3600: cache for 1 hour at the Vercel Edge Network (CDN)
            // stale-while-revalidate: serve old content while background updating
            value:
              "public, max-age=0, s-maxage=3600, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
