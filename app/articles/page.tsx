import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "Articles — Occudule",
  description: "Articles on family productivity, email, and parenting from Occudule.",
};

export default function ArticlesPage() {
  return (
    <ContentPageShell
      sectionLabel="ARTICLES"
      title="Articles"
      description="Content coming soon. We will share tips and insights for parents managing school, work, and home."
    />
  );
}
