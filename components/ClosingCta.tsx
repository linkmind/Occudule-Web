import { CtaButton } from "@/components/CtaButton";

export function ClosingCta() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-b border-border bg-primary py-section text-surface"
      aria-labelledby="closing-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-40 mix-blend-screen"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-gutter text-center">
        <h2
          id="closing-heading"
          className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.5rem]"
        >
          Take control of family email with clarity and confidence.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
          Track what needs you, draft in your voice, and protect time for what happens off-screen.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <CtaButton href="mailto:support@occudule.com?subject=Occudule%20waitlist" size="lg">
            Get early access
          </CtaButton>
          <CtaButton
            href="mailto:support@occudule.com?subject=Occudule%20demo"
            variant="onDark"
            size="lg"
          >
            Book a demo
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
