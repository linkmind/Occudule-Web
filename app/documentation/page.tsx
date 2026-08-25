import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ContentPageShell";
import { DocumentationSection } from "@/components/DocumentationSection";
import { DOC_SECTIONS, getAllDocs, getDocPath, getDocsBySection } from "@/lib/documentation";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Occudule documentation";
const DESCRIPTION =
  "Guides for Occudule features, free account setup, and upgrades—so parents can connect school email and manage family schedules in one place.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: "/documentation",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: "/documentation",
  },
};

export default function DocumentationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/documentation"),
    hasPart: getAllDocs().map((doc) => ({
      "@type": "TechArticle",
      headline: doc.title,
      description: doc.description,
      url: absoluteUrl(getDocPath(doc)),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPageShell
        sectionLabel="DOCUMENTATION"
        title={TITLE}
        description={DESCRIPTION}
        after={
          <>
            {DOC_SECTIONS.map((section) => (
              <DocumentationSection
                key={section.slug}
                section={section.slug}
                label={section.label}
                docs={getDocsBySection(section.slug)}
              />
            ))}
          </>
        }
      />
    </>
  );
}
