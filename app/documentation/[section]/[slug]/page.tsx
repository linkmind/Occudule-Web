import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageShell } from "@/components/ContentPageShell";
import { LegalMarkdown } from "@/components/LegalMarkdown";
import {
  formatDocTitle,
  getAllDocs,
  getDoc,
  getDocPath,
  getDocSectionLabel,
  getHowToSteps,
  isDocSectionSlug,
} from "@/lib/documentation";
import { absoluteUrl } from "@/lib/site";

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
    return { title: "Occudule documentation" };
  }

  const doc = getDoc(section, slug);
  if (!doc) {
    return { title: "Occudule documentation" };
  }

  const path = getDocPath(doc);
  const title = formatDocTitle(doc.title);
  const description = doc.description ?? `${doc.title} — Occudule documentation.`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: doc.title,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      title: doc.title,
      description,
    },
    alternates: {
      canonical: path,
    },
  };
}

export default async function DocumentationDocPage({ params }: DocumentationDocPageProps) {
  const { section, slug } = await params;
  if (!isDocSectionSlug(section)) notFound();

  const doc = getDoc(section, slug);
  if (!doc) notFound();

  const path = getDocPath(doc);
  const url = absoluteUrl(path);
  const steps = section === "how-tos" ? getHowToSteps(doc.content) : [];
  const jsonLd =
    steps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: doc.title,
          description: doc.description,
          url,
          step: steps.map((step) => ({
            "@type": "HowToStep",
            name: step.name,
            text: step.text,
          })),
        }
      : {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: doc.title,
          description: doc.description,
          url,
          author: {
            "@type": "Organization",
            name: "Occudule",
          },
          publisher: {
            "@type": "Organization",
            name: "Outvblue Technology Inc.",
          },
        };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPageShell
        sectionLabel={getDocSectionLabel(section).toUpperCase()}
        title={doc.title}
        description={doc.lede}
        backHref="/documentation"
        backLabel="← Back to documentation"
      >
        {doc.content ? <LegalMarkdown content={doc.content} /> : null}
      </ContentPageShell>
    </>
  );
}
