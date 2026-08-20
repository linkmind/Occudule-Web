import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageShell } from "@/components/ContentPageShell";
import { LegalMarkdown } from "@/components/LegalMarkdown";
import {
  getAllDocs,
  getDoc,
  getDocSectionLabel,
  isDocSectionSlug,
} from "@/lib/documentation";

type DocumentationDocPageProps = {
  params: Promise<{ section: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({
    section: doc.section,
    slug: doc.slug,
  }));
}

export async function generateMetadata({
  params,
}: DocumentationDocPageProps): Promise<Metadata> {
  const { section, slug } = await params;
  if (!isDocSectionSlug(section)) {
    return { title: "Documentation — Occudule" };
  }

  const doc = getDoc(section, slug);
  if (!doc) {
    return { title: "Documentation — Occudule" };
  }

  return {
    title: `${doc.title} — Occudule`,
    description: doc.description ?? `${doc.title} documentation for Occudule.`,
  };
}

export default async function DocumentationDocPage({ params }: DocumentationDocPageProps) {
  const { section, slug } = await params;
  if (!isDocSectionSlug(section)) notFound();

  const doc = getDoc(section, slug);
  if (!doc) notFound();

  return (
    <ContentPageShell
      sectionLabel={getDocSectionLabel(section).toUpperCase()}
      title={doc.title}
      description={doc.description}
      backHref="/documentation"
      backLabel="← Back to documentation"
    >
      {doc.content ? <LegalMarkdown content={doc.content} /> : null}
    </ContentPageShell>
  );
}
