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
  content: string;
  section: DocSectionSlug;
};

const DOCS_DIR = path.join(process.cwd(), "content", "documentation");

export function isDocSectionSlug(value: string): value is DocSectionSlug {
  return DOC_SECTIONS.some((section) => section.slug === value);
}

export function getDocSectionLabel(section: DocSectionSlug): string {
  return DOC_SECTIONS.find((item) => item.slug === section)?.label ?? section;
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

function titleFromBody(body: string): string | undefined {
  const heading = body.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim();
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stripLeadingH1(body: string): string {
  return body.replace(/^#\s+.+(?:\r?\n)+/, "").trim();
}

function listMarkdownFiles(section: DocSectionSlug): string[] {
  const dir = path.join(DOCS_DIR, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .sort((a, b) => a.localeCompare(b));
}

function readDoc(section: DocSectionSlug, filename: string): DocumentationDoc {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DOCS_DIR, section, filename), "utf-8");
  const { data, body } = parseFrontmatter(raw);

  const title = data.title || titleFromBody(body) || slugToTitle(slug);

  return {
    slug,
    title,
    description: data.description || undefined,
    content: stripLeadingH1(body),
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
      section: doc.section,
    };
  });
}

export function getDoc(section: DocSectionSlug, slug: string): DocumentationDoc | null {
  const filename = listMarkdownFiles(section).find((file) => file.replace(/\.md$/, "") === slug);
  if (!filename) return null;
  return readDoc(section, filename);
}

export function getAllDocs(): Omit<DocumentationDoc, "content">[] {
  return DOC_SECTIONS.flatMap((section) => getDocsBySection(section.slug));
}
