import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { getAllDocs, getDocPath } from "@/lib/documentation";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about",
    "/contact",
    "/waitlist",
    "/documentation",
    "/articles",
    "/privacy",
    "/terms",
  ];

  const docs = getAllDocs().map((doc) => ({
    url: `${SITE_URL}${getDocPath(doc)}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articles = getPublishedArticles().map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.6,
    })),
    ...docs,
    ...articles,
  ];
}
