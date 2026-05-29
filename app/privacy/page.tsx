import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";
import { getLegalMarkdown, LEGAL_FILES } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Occudule",
  description:
    "Privacy Policy for Occudule by Outvblue Technology Inc. How we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  const content = getLegalMarkdown(LEGAL_FILES.privacy);
  return <LegalPageShell content={content} />;
}
