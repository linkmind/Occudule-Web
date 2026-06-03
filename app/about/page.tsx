import type { Metadata } from "next";
import Link from "next/link";
import { AboutClosingCta } from "@/components/AboutClosingCta";
import { AboutHero } from "@/components/AboutHero";
import { AboutNarrativeBlock } from "@/components/AboutNarrativeBlock";
import { AboutValuesGrid } from "@/components/AboutValuesGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "About Us | Occudule — Made by Parents, for Parents",
  description:
    "Discover the mission behind Occudule. Founded in Ontario, we harness innovative technology to clear the digital clutter of parenting and ease the family mental load.",
  openGraph: {
    title: "About Occudule | Empowering Modern Families",
    description:
      "We build elegant tech solutions to streamline school logistics, schedules, and family communication.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <Link
          href="/"
          className="mx-auto block max-w-content px-gutter pt-8 text-sm font-medium text-white/50 transition hover:text-white"
        >
          ← Back to home
        </Link>
        <AboutHero />
        <AboutValuesGrid />
        <AboutNarrativeBlock />
        <AboutClosingCta />
      </main>
      <Footer />
    </>
  );
}
