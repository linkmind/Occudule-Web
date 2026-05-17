const pillars = [
  {
    title: "Live thread awareness",
    body: "Stay current as messages arrive—Occudule highlights what needs you today versus what can wait.",
  },
  {
    title: "Unified family view",
    body: "School, sports, medical, and co-parenting threads stay grouped so nothing slips through.",
  },
  {
    title: "Tone-matched drafts",
    body: "Replies sound like you: warm with teachers, crisp at work, quick with coaches.",
  },
  {
    title: "Deadline extraction",
    body: "Forms, payments, and RSVP dates surface automatically from long email chains.",
  },
  {
    title: "Noise containment",
    body: "Newsletters and promos sink into the background until you choose to batch-read.",
  },
  {
    title: "Privacy-minded design",
    body: "Built so family data stays yours—clear controls as we move toward broader access.",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why-occudule"
      className="border-b border-border bg-surface-muted py-section"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Why choose Occudule
        </p>
        <h2
          id="why-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Designed to scale with your household—not add another chore.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          From one child to three activities and a full-time job, the same calm workflow keeps
          your attention where it belongs.
        </p>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item) => (
            <li key={item.title}>
              <article className="h-full rounded-card border border-border bg-surface p-6 shadow-card transition hover:border-primary/15 hover:shadow-lg">
                <h3 className="text-lg font-semibold tracking-tight text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary/70">{item.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
