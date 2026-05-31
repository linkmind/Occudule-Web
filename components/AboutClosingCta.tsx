import { CtaButton } from "@/components/CtaButton";

export function AboutClosingCta() {
  return (
    <section
      className="bg-surface py-section"
      aria-labelledby="about-cta-heading"
    >
      <div className="mx-auto max-w-content px-gutter text-center">
        <h2
          id="about-cta-heading"
          className="text-2xl font-bold tracking-tight text-primary md:text-3xl"
        >
          Streamline your family logistics today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary/70">
          Join parents who are clearing inbox clutter and staying ahead of school and activity
          schedules.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButton href="/waitlist" size="lg">
            Get early access
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
