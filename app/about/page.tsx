import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "About Us — Occudule",
  description: "About Outvblue Technology Inc. and Occudule, AI email productivity for busy parents.",
};

export default function AboutPage() {
  return (
    <ContentPageShell
      title="About Us"
      description="Content coming soon. Occudule is built by Outvblue Technology Inc. to help busy parents stay on top of family email."
    />
  );
}
