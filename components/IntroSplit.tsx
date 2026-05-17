export function IntroSplit() {
  return (
    <section
      id="about"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="intro-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <h2 id="intro-heading" className="sr-only">
          Why Occudule
        </h2>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Instant context
            </p>
            <p className="mt-4 text-lg font-medium leading-relaxed text-primary md:text-xl">
              Occudule turns scattered threads into clear next steps by securely understanding
              what matters for your family—school, sports, caregivers, and work—in one view.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-success">
              Actionable by default
            </p>
            <p className="mt-4 text-lg font-medium leading-relaxed text-primary md:text-xl">
              Receive intelligent drafts and reminders designed to protect your time: fewer
              tab switches, fewer missed deadlines, and more headspace for real life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
