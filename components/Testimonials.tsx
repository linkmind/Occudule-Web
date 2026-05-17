const quotes = [
  {
    name: "Jordan M.",
    role: "Parent of two · Product lead",
    quote:
      "I stopped checking email on the bleachers. Occudule surfaces school stuff first and drafts sound like me—I send in one tap after a quick scan.",
  },
  {
    name: "Priya S.",
    role: "PTA treasurer",
    quote:
      "Threads that used to take twenty minutes to parse now show up with a summary and the three things I actually need to do.",
  },
  {
    name: "Alex R.",
    role: "Remote engineer · Coach on weekends",
    quote:
      "Finally one place where work and family logistics don’t fight for the same mental bandwidth. The tone matching is eerily good.",
  },
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-success/80 text-sm font-bold text-primary"
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-b border-border bg-surface-muted py-section"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Testimonials
        </p>
        <h2
          id="testimonials-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Trusted by parents who live in their inbox out of necessity
        </h2>
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {quotes.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-card">
                <blockquote className="flex-1 text-sm leading-relaxed text-primary/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <Avatar name={t.name} />
                  <div>
                    <p className="font-semibold text-primary">{t.name}</p>
                    <p className="text-xs text-primary/55">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
