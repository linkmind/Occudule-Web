import { CtaButton } from "@/components/CtaButton";

export function ClosingCta() {
  return (
    <section
      className="relative border-b border-white/10 bg-cta-band py-section"
      aria-labelledby="closing-cta-heading"
    >
      <div className="mesh-overlay opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter text-center">
        <p className="text-xs font-medium tracking-wide text-white/45">[ GET EARLY ACCESS ]</p>
        <h2
          id="closing-cta-heading"
          className="text-gradient mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
        >
          Ready to simplify family email?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/60">
          Join the waitlist and be first to turn school threads into organized action—without
          another complicated dashboard.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CtaButton href="/waitlist" size="lg">
            Join the waitlist
          </CtaButton>
          <CtaButton href="/contact" variant="ghost" size="lg">
            Contact us
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
