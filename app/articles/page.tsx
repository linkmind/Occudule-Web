import type { Metadata } from "next";
import { ArticlesList } from "@/components/ArticlesList";
import { ContentPageShell } from "@/components/ContentPageShell";
import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles — Occudule",
  description: "Articles on family productivity, email, and parenting from Occudule.",
  alternates: {
    types: {
      "application/rss+xml": "/articles/rss.xml",
    },
  },
};

export default function ArticlesPage() {
  const articles = getPublishedArticles();

  return (
    <ContentPageShell sectionLabel="ARTICLES" after={<ArticlesList articles={articles} />} />
  );
}
