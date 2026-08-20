import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ContentPageShell";
import { DocumentationSection } from "@/components/DocumentationSection";
import { DOC_SECTIONS, getDocsBySection } from "@/lib/documentation";

export const metadata: Metadata = {
  title: "Documentation — Occudule",
  description: "Documentation and product guides for Occudule.",
};

export default function DocumentationPage() {
  return (
    <ContentPageShell
      sectionLabel="DOCUMENTATION"
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
  );
}
