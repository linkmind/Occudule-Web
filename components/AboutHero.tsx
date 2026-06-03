export function AboutHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-background"
      aria-labelledby="about-mission-heading"
    >
      <div className="mesh-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-gutter py-section text-center md:py-24">
        <p className="text-xs font-medium tracking-wide text-white/45">[ ABOUT OCCUDULE ]</p>
        <h1
          id="about-mission-heading"
          className="text-gradient mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
        >
          Made by parents, for parents
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/60 md:text-xl">
          <span className="font-semibold text-white">Our mission:</span> To champion parents and
          support their children&apos;s success by leveraging the power of rapidly evolving
          technology.
        </p>
      </div>
    </section>
  );
}
