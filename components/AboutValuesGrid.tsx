const values = [
  {
    title: "Integrity & Excellence",
    body: "Do the right things, and do them right.",
    highlight: "Built on trust",
  },
  {
    title: "Community-Minded",
    body: "Building solutions that uplift and connect families.",
    highlight: "Families first",
  },
  {
    title: "Tech-Savvy",
    body: "Embracing modern innovation to solve real-world parenting challenges.",
    highlight: "Innovation with purpose",
  },
];

export function AboutValuesGrid() {
  return (
    <section
      className="border-b border-border bg-surface py-section"
      aria-labelledby="about-values-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <h2
          id="about-values-heading"
          className="text-center text-2xl font-bold tracking-tight text-primary md:text-3xl"
        >
          What guides us
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <li key={item.title}>
              <article className="flex h-full flex-col rounded-card border border-border bg-surface-muted/40 p-6 shadow-card transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary/15 hover:shadow-lg md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-cta">
                  {item.highlight}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-primary/70">{item.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
