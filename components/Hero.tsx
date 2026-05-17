import { CtaButton } from "@/components/CtaButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border bg-surface-muted"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat"
        aria-hidden
      />
      <motionless-glow />
    </section>
  );
}
