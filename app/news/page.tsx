import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "News — Occudule",
  description: "Occudule news and announcements.",
};

export default function NewsPage() {
  return (
    <ContentPageShell
      sectionLabel="NEWS"
      title="News"
      description="Content coming soon. Check back for product updates and company announcements."
    />
  );
}
