import fs from "fs";
import path from "path";

export const DOC_SECTIONS = [
  { slug: "features", label: "Features" },
  { slug: "how-tos", label: "How-tos" },
] as const;

export type DocSectionSlug = (typeof DOC_SECTIONS)[number]["slug"];

export type DocumentationDoc = {
  slug: string;
  title: string;
  description?: string;
  lede?: string;
  content: string;
  section: DocSectionSlug;
};

export type HowToStep = {
  name: string;
  text: string;
};

const DOCS_DIR = path.join(process.cwd(), "content", "documentation");

export function isDocSectionSlug(value: string): value is DocSectionSlug {
  return DOC_SECTIONS.some((section) => section.slug === value);
}

export function getDocSectionLabel(section: DocSectionSlug): string {
  return DOC_SECTIONS.find((item) => item.slug === section)?.label ?? section;
}

export function getDocPath(doc: Pick<DocumentationDoc, "section" | "slug">): string {
  return `/documentation/${doc.section}/${doc.slug}`;
}

export function formatDocTitle(title: string): string {
  return title.includes("Occudule") ? title : `${title} — Occudule`;
}

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
    .find((block) => block.length > 0 && !block.startsWith("---"));

  if (!paragraph) return undefined;
  if (paragraph.length <= 160) return paragraph;
  return `${paragraph.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

function listMarkdownFiles(section: DocSectionSlug): string[] {
  const dir = path.join(DOCS_DIR, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .filter((file) => !file.startsWith("_"))
    .sort((a, b) => a.localeCompare(b));
}

function filenameToSlug(filename: string): string {
  return slugify(filename.replace(/\.md$/i, ""));
}

function readDoc(section: DocSectionSlug, filename: string): DocumentationDoc {
  const raw = fs.readFileSync(path.join(DOCS_DIR, section, filename), "utf-8").replace(/^\uFEFF/, "");
  const { data, body } = parseFrontmatter(raw);
  const slug = slugify(data.slug || filenameToSlug(filename));
  const content = stripLeadingH1(body);
  const title = data.title || titleFromBody(body) || slugToTitle(slug);
  const lede = data.description || undefined;

  return {
    slug,
    title,
    description: lede || excerptFromBody(body),
    lede,
    content,
    section,
  };
}

export function getDocsBySection(section: DocSectionSlug): Omit<DocumentationDoc, "content">[] {
  return listMarkdownFiles(section).map((filename) => {
    const doc = readDoc(section, filename);
    return {
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      lede: doc.lede,
      section: doc.section,
    };
  });
}

export function getDoc(section: DocSectionSlug, slug: string): DocumentationDoc | null {
  const filename = listMarkdownFiles(section).find((file) => filenameToSlug(file) === slug);
  if (!filename) return null;
  return readDoc(section, filename);
}

export function getAllDocs(): Omit<DocumentationDoc, "content">[] {
  return DOC_SECTIONS.flatMap((section) => getDocsBySection(section.slug));
}

export function getHowToSteps(content: string): HowToStep[] {
  return content
    .split(/^##\s+/m)
    .slice(1)
    .map((block) => {
      const [nameLine, ...rest] = block.split(/\r?\n/);
      const text = rest
        .join(" ")
        .replace(/^#+\s+/gm, "")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      return {
        name: nameLine?.trim() ?? "",
        text,
      };
    })
    .filter((step) => step.name);
}
