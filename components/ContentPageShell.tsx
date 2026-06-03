import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type ContentPageShellProps = {
  sectionLabel: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function ContentPageShell({
  sectionLabel,
  title,
  description,
  children,
}: ContentPageShellProps) {
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
          <div className="relative mx-auto max-w-content px-gutter pb-10 pt-8 md:pb-12">
            <Link
              href="/"
              className="text-sm font-medium text-white/50 transition hover:text-white"
            >
              ← Back to home
            </Link>
            <p className="mx-auto mt-10 max-w-3xl text-center text-xs font-medium tracking-wide text-white/45">
              [ {sectionLabel} ]
            </p>
          </div>
        </section>

        <section
          className="section-dark pb-section pt-10 md:pt-12"
          aria-labelledby="content-page-heading"
        >
          <div className="mesh-overlay opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-gutter">
            <div className="glass-card p-6 md:p-10">
              <h1
                id="content-page-heading"
                className="text-gradient text-3xl font-semibold tracking-tight md:text-4xl"
              >
                {title}
              </h1>
              {description ? (
                <p className="mt-4 text-lg leading-relaxed text-white/60">{description}</p>
              ) : null}
              {children ? <div className="mt-8 text-white/65">{children}</div> : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
