import { CtaButton } from "@/components/CtaButton";

export function ClosingCta() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-surface-muted py-section"
      aria-labelledby="closing-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-60"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-gutter text-center">
        <h2
          id="closing-heading"
          className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Ready to take email off your mental load?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary/70">
          Join the Occudule waitlist—be first to get AI that respects your family&apos;s privacy
          and your time.
        </p>
        <div className="mt-10 flex justify-center">
          <CtaButton href="mailto:support@occudule.com?subject=Occudule%20waitlist" size="lg">
            Email us to join the waitlist
          </CtaButton>
        </div>
        <p id="pricing-preview" className="mt-6 text-sm text-primary/50">
          Simple pricing at launch—no surprise tiers for families.
        </p>
      </div>
    </section>
  );
}
