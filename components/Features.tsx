const features = [
  {
    title: "Smart triage",
    description:
      "Important messages from schools, coaches, and caregivers surface first—newsletters and noise wait their turn.",
  },
  {
    title: "Drafts in your voice",
    description:
      "Occudule learns how you write so replies sound like you, not a robot—edit in seconds and send with confidence.",
  },
  {
    title: "Family-aware context",
    description:
      "Link calendars and threads so follow-ups, deadlines, and “who’s picking up whom” stay tied together.",
  },
];

export function Features() {
  return (
    <section
      id="how-it-works"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/55">
          How it works
        </p>
        <h2
          id="features-heading"
          className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Less time in email. More clarity for your week.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Three pillars designed around how parents actually manage communication.
        </p>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((item, index) => (
            <li key={item.title}>
              <article className="flex h-full flex-col rounded-card border border-border bg-surface-muted/60 p-8 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-primary/70">
                  {item.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
