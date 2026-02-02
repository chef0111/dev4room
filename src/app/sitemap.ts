import type { MetadataRoute } from "next";
import { baseUrl } from "@/common/constants";
import { db } from "@/database/drizzle";
import { question, user } from "@/database/schema";
import { eq, and, not } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic question pages
  const questions = await db
    .select({
      id: question.id,
      updatedAt: question.updatedAt,
    })
    .from(question)
    .where(eq(question.status, "approved"));

  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${baseUrl}/questions/${q.id}`,
    lastModified: q.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic user profile pages
  const users = await db
    .select({
      username: user.username,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(and(eq(user.emailVerified, true), not(eq(user.banned, true))));

  const userPages: MetadataRoute.Sitemap = users.map((u) => ({
    url: `${baseUrl}/${u.username}`,
    lastModified: u.updatedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...questionPages, ...userPages];
}
