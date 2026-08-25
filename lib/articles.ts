import fs from "fs";
import path from "path";

export type Article = {
  slug: string;
  title: string;
  description?: string;
  lede?: string;
  date?: string;
  author?: string;
  tags: string[];
  draft: boolean;
  content: string;
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})-(.+)$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }

  return { data, body: match[2] };
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromBody(body: string): string | undefined {
  const heading = body.trim().match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim();
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stripLeadingH1(body: string): string {
  return body.trim().replace(/^#\s+.+(?:\r?\n)+/, "").trim();
}

function normalizeDate(value?: string): string | undefined {
  if (!value) return undefined;
  const match = value.trim().match(ISO_DATE);
  if (!match) return undefined;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseTags(value?: string): string[] {
  if (!value) return [];
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function isDraft(value?: string): boolean {
  if (!value) return false;
  return ["true", "1", "yes"].includes(value.trim().toLowerCase());
}

function excerptFromBody(body: string): string | undefined {
  const paragraph = stripLeadingH1(body)
    .split(/\r?\n\r?\n+/)
    .map((block) =>
      block
        .replace(/^#+\s+/gm, "")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .find((block) => block.length > 0);

  if (!paragraph) return undefined;
  if (paragraph.length <= 160) return paragraph;
  return `${paragraph.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

function listArticleFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.toLowerCase().endsWith(".md"))
    .filter((file) => file.toLowerCase() !== "readme.md")
    .filter((file) => !file.startsWith("_"));
}

function filenameToSlug(filename: string): { slug: string; dateFromName?: string } {
  const stem = filename.replace(/\.md$/i, "");
  const dated = stem.match(DATE_PREFIX);
  if (dated) {
    return { slug: slugify(dated[2]) || slugify(stem), dateFromName: dated[1] };
  }
  return { slug: slugify(stem) };
}

function readArticle(filename: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const { data, body } = parseFrontmatter(raw);
  const { slug: slugFromName, dateFromName } = filenameToSlug(filename);
  const slug = slugify(data.slug || slugFromName);
  if (!slug) return null;

  const content = stripLeadingH1(body);
  const title = data.title || titleFromBody(body) || slugToTitle(slug);
  const lede = data.description || undefined;

  return {
    slug,
    title,
    description: lede || excerptFromBody(body),
    lede,
    date: normalizeDate(data.date) || dateFromName,
    author: data.author || undefined,
    tags: parseTags(data.tags || data.keywords),
    draft: isDraft(data.draft),
    content,
  };
}

function compareArticles(a: Article, b: Article): number {
  if (a.date && b.date && a.date !== b.date) {
    return a.date < b.date ? 1 : -1;
  }
  if (a.date && !b.date) return -1;
  if (!a.date && b.date) return 1;
  return a.title.localeCompare(b.title);
}

export function getAllArticles(): Article[] {
  return listArticleFiles()
    .map(readArticle)
    .filter((article): article is Article => Boolean(article))
    .sort(compareArticles);
}

export function getPublishedArticles(): Article[] {
  return getAllArticles().filter((article) => !article.draft);
}

export function getPublishedArticle(slug: string): Article | null {
  return getPublishedArticles().find((article) => article.slug === slug) ?? null;
}

export function formatArticleDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
