import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageShell } from "@/components/ContentPageShell";
import { LegalMarkdown } from "@/components/LegalMarkdown";
import {
  formatArticleDate,
  getPublishedArticle,
  getPublishedArticles,
} from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) {
    return { title: "Articles — Occudule" };
  }

  const title = article.title.includes("Occudule")
    ? article.title
    : `${article.title} — Occudule`;

  return {
    title,
    description: article.description ?? `${article.title} — Occudule article.`,
    authors: article.author ? [{ name: article.author }] : [{ name: "Occudule" }],
    keywords: article.tags.length ? article.tags : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags.length ? article.tags : undefined,
    },
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": article.author ? "Person" : "Organization",
      name: article.author ?? "Occudule",
    },
    publisher: {
      "@type": "Organization",
      name: "Outvblue Technology Inc.",
    },
    keywords: article.tags.length ? article.tags.join(", ") : undefined,
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
  };

  const byline = [article.date, article.author].some(Boolean) ? (
    <>
      {article.date ? (
        <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
      ) : null}
      {article.date && article.author ? " · " : null}
      {article.author ? <span>{article.author}</span> : null}
    </>
  ) : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPageShell
        sectionLabel="ARTICLES"
        title={article.title}
        byline={byline}
        description={article.lede}
        backHref="/articles"
        backLabel="← Back to articles"
      >
        {article.content ? <LegalMarkdown content={article.content} /> : null}
      </ContentPageShell>
    </>
  );
}
