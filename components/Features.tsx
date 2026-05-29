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
  {
    title: "Events & to-dos from email",
    description:
      "School dates, forms, and action items are extracted automatically so you spend less time copying into your calendar.",
  },
  {
    title: "Conflict detection",
    description:
      "See when new commitments clash with what’s already on the family calendar before you double-book.",
  },
  {
    title: "One calm inbox view",
    description:
      "Household, school, and work threads in one prioritized stream—without merging accounts blindly.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Features
        </p>
        <h2
          id="features-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Everything you need to stay on top of family email
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Built for how parents actually manage school, sports, work, and home—without another
          complicated dashboard.
        </p>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <li key={item.title}>
              <article className="flex h-full flex-col rounded-card border border-border bg-surface-muted/60 p-6 shadow-card">
                <h3 className="text-lg font-semibold tracking-tight text-primary">{item.title}</h3>
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
