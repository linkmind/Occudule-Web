import Link from "next/link";
import { formatArticleDate, type Article } from "@/lib/articles";

type ArticlesListProps = {
  articles: Article[];
};

export function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <section className="glass-card" aria-labelledby="articles-heading">
      <div className="border-b border-white/10 px-6 py-5 md:px-10 md:py-6">
        <h2 id="articles-heading" className="text-xl font-semibold tracking-tight text-white md:text-2xl">
          Latest
        </h2>
      </div>

      {articles.length === 0 ? (
        <p className="px-6 py-6 text-base leading-relaxed text-white/55 md:px-10">
          Articles coming soon.
        </p>
      ) : (
        <ul className="divide-y divide-white/10">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex items-start justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.04] md:px-10"
              >
                <span className="min-w-0">
                  {article.date ? (
                    <time
                      dateTime={article.date}
                      className="block text-xs font-medium tracking-wide text-white/40"
                    >
                      {formatArticleDate(article.date)}
                    </time>
                  ) : null}
                  <span className="mt-1 block font-semibold text-white transition group-hover:text-accent">
                    {article.title}
                  </span>
                  {article.description ? (
                    <span className="mt-1 block text-sm leading-relaxed text-white/55">
                      {article.description}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 shrink-0 text-white/35 transition group-hover:text-accent" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
