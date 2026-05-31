import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
      <main className="relative overflow-hidden border-b border-border bg-surface-muted bg-mesh">
        <div
          className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-content gap-12 px-gutter py-section lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-primary/60 transition hover:text-primary"
            >
              ← Back to home
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary/55">
              Early access
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Join the Occudule waitlist
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-primary/75">
              Occudule is built for parents who need school threads, drafts, and deadlines handled
              without living in their inbox. Save your spot—we&apos;ll email you when your invite
              is ready.
            </p>
            <ul className="mt-8 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-primary/80">
                  <span className="mt-0.5 font-bold text-success" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-primary/50">
              Questions?{" "}
              <a
                href="mailto:support@occudule.com?subject=Occudule%20waitlist"
                className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
              >
                support@occudule.com
              </a>
            </p>
          </div>
          <WaitlistForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
