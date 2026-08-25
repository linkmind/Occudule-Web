import { getPublishedArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const articles = getPublishedArticles();
  const items = articles
    .map((article) => {
      const link = `${SITE_URL}/articles/${article.slug}`;
      const pubDate = article.date
        ? new Date(`${article.date}T00:00:00.000Z`).toUTCString()
        : undefined;

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      ${article.description ? `<description>${escapeXml(article.description)}</description>` : ""}
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Occudule Articles</title>
    <link>${SITE_URL}/articles</link>
    <description>Articles on family productivity, email, and parenting from Occudule.</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
