import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";
import { getLegalMarkdown, LEGAL_FILES } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service — Occudule",
  description:
    "Terms of Service for Occudule by Outvblue Technology Inc. Rules for using the Occudule app and related services.",
};

export default function TermsOfServicePage() {
  const content = getLegalMarkdown(LEGAL_FILES.terms);
  return <LegalPageShell content={content} />;
}
