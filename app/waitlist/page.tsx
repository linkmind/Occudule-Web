import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist — Occudule",
  description:
    "Join the Occudule waitlist for early access to AI email productivity built for busy parents.",
};

const benefits = [
  "Be first to try Occudule when early access opens",
  "Lock in founding-member pricing before public launch",
  "Help shape features for school, sports, and family email",
];

export default function WaitlistPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-background">
          <div className="mesh-overlay" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat"
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-gutter pb-12 pt-8 md:pb-16">
            <Link
              href="/"
              className="text-sm font-medium text-white/50 transition hover:text-white"
            >
              ← Back to home
            </Link>
            <div className="mx-auto mt-10 max-w-2xl text-center">
              <SectionHeader
                label="EARLY ACCESS"
                title="Join the Occudule waitlist"
                description="Occudule is built for parents who need school threads, drafts, and deadlines handled without living in their inbox. Save your spot—we'll email you when your invite is ready."
                titleId="waitlist-heading"
              />
            </div>
          </div>
        </section>

        <section className="section-dark py-section" aria-label="Waitlist signup">
          <div className="mesh-overlay opacity-40" aria-hidden />
          <div className="relative mx-auto grid max-w-content gap-10 px-gutter lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <ul className="space-y-3">
                {benefits.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/80">
                    <span className="mt-0.5 font-bold text-success" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-white/50">
                Questions?{" "}
                <a
                  href="mailto:support@occudule.com?subject=Occudule%20waitlist"
                  className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
                >
                  support@occudule.com
                </a>
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
