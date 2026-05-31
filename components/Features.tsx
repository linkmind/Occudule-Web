const features = [
  {
    title: "Optimized specially for family emails",
    tagline: "Purpose-built context mapping for household logistics.",
    description:
      "An AI engine configured with specialized workflows to instantly recognize and prioritize child-related emails, school announcements, and youth activities.",
  },
  {
    title: "Smart email analysis & extraction",
    tagline: "Say goodbye to manual sorting.",
    description:
      "Instantly analyzes incoming messages to extract key dates, locations, and action items, cleanly categorizing them so nothing gets lost in the noise.",
  },
  {
    title: "Automated task management & reminders",
    tagline: "Turning communication into direct action.",
    description:
      "Instantly converts incoming emails into structured to-do lists, calendar events, and reference info cards. It automatically schedules reminders and delegates tasks, keeping your entire household perfectly on track.",
  },
  {
    title: "Family co-working hub",
    tagline: "Share the mental load seamlessly.",
    description:
      "A unified digital workspace that enables parents and family members to collaborate, share the mental load, and coordinate logistics in real time.",
  },
  {
    title: "Intelligent auto-draft replies",
    tagline: "Communication on autopilot.",
    description:
      "Saves time with smart, context-aware email responses drafted automatically and ready for you to review and send with a single tap.",
  },
  {
    title: "Smart conflict detection",
    tagline: "Protect your family calendar.",
    description:
      "Scans family schedules in real time to instantly detect overlapping activities and time conflicts before they become scheduling nightmares.",
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
          Core product features
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Purpose-built modules that turn family email into organized action—without another
          complicated dashboard.
        </p>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <li key={item.title}>
              <article className="flex h-full flex-col rounded-card border border-border bg-surface-muted/60 p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {item.tagline}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-primary">
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
