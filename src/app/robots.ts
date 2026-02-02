import type { MetadataRoute } from "next";
import { baseUrl } from "@/common/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/rpc/",
          "/dashboard/",
          "/admin/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/banned",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
