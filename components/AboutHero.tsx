export function AboutHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-border bg-surface-muted"
      aria-labelledby="about-mission-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat opacity-90"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-gutter py-section text-center md:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/55">
          About Occudule
        </p>
        <h1
          id="about-mission-heading"
          className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl"
        >
          Made by parents, for parents
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-primary/75 md:text-xl">
          <span className="font-semibold text-primary">Our mission:</span> To champion parents and
          support their children&apos;s success by leveraging the power of rapidly evolving
          technology.
        </p>
      </div>
    </section>
  );
}
