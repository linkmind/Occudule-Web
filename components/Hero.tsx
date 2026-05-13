import { CtaButton } from "@/components/CtaButton";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-border bg-surface-muted"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-gutter py-section md:py-24">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-primary/60">
          AI email for busy parents
        </p>
        <h1
          id="hero-heading"
          className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl"
        >
          Your inbox, handled—so you can be present at home.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-primary/75 md:text-xl">
          Occudule uses AI to triage school threads, summarize long chains, and
          draft replies in your voice—cutting email time without dropping the
          ball on what matters for your family.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <CtaButton href="#waitlist" size="lg">
            Join the waitlist
          </CtaButton>
          <CtaButton href="#how-it-works" variant="secondary" size="lg">
            See how it works
          </CtaButton>
        </div>
        <p className="mt-6 text-center text-sm text-primary/50">
          Built for parents juggling work, school, sports, and everything in between.
        </p>
      </div>
    </section>
  );
}
