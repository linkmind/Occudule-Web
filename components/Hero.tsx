import { CtaButton } from "@/components/CtaButton";

const testimonials = [
  {
    quote: "Finally caught the permission slip before Friday.",
    name: "Maya R.",
    role: "Parent of two",
  },
  {
    quote: "We stopped double-booking soccer and piano.",
    name: "James T.",
    role: "Working dad",
  },
  {
    quote: "School email takes minutes, not an hour.",
    name: "Priya K.",
    role: "Mom & PM",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="mesh-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-success/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-content px-gutter pb-16 pt-section md:pb-20 md:pt-24">
        <p className="mb-4 text-center text-xs font-medium tracking-wide text-white/45">
          [ AI EMAIL FOR BUSY PARENTS ]
        </p>
        <h1
          id="hero-heading"
          className="text-gradient mx-auto max-w-4xl text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
        >
          Your inbox, handled—so you can be present at home and work.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-white/60 md:text-lg">
          Occudule uses AI to cut the time you spent on email and manual tasks without dropping
          the ball on what matters for your family.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <CtaButton href="/waitlist" size="lg">
            Join the waitlist
          </CtaButton>
          <CtaButton href="/#how-it-works" variant="ghost" size="lg">
            See how it works
          </CtaButton>
        </div>

        <div className="mt-14 overflow-hidden md:mt-16">
          <div className="flex animate-marquee gap-4 whitespace-nowrap">
            {[...testimonials, ...testimonials].map((item, i) => (
              <figure
                key={`${item.name}-${i}`}
                className="glass-card inline-flex min-w-[280px] shrink-0 flex-col px-5 py-4 sm:min-w-[320px]"
              >
                <blockquote className="text-sm leading-relaxed text-white/85">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  <span className="font-semibold text-white/70">{item.name}</span>
                  <span aria-hidden>·</span>
                  <span>{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
