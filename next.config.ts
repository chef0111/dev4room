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
        hostname: "*",
        port: "",
      },
    ],
  },
};

export default nextConfig;
