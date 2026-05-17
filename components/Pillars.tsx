const items = [
  {
    title: "All your threads",
    body: "See household, school, and work mail in one prioritized stream—without merging accounts blindly.",
  },
  {
    title: "Auto-sorted urgency",
    body: "Occudule classifies messages as you go so newsletters never bury permission slips again.",
  },
  {
    title: "Smart tips by AI",
    body: "Short nudges when something needs a calendar block, payment, or reply before pickup time.",
  },
];

export function Pillars() {
  return (
    <section
      id="pillars"
      className="border-b border-border bg-surface-muted py-section"
      aria-labelledby="pillars-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <h2
          id="pillars-heading"
          className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Track what matters most, wherever the day takes you.
        </h2>
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.title}>
              <article className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface shadow-card">
                  <span className="text-lg font-bold text-accent" aria-hidden>
                    ◆
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary/70">{item.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
