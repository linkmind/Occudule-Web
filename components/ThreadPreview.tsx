const threads = [
  {
    tag: "School",
    title: "Winter concert — volunteer slots",
    meta: "Due Jan 28 · 2 actions",
    tone: "priority" as const,
  },
  {
    tag: "Sports",
    title: "Practice moved to 6:15 PM Thursday",
    meta: "Calendar suggestion ready",
    tone: "default" as const,
  },
  {
    tag: "Health",
    title: "Appointment reminder — Dr. Patel",
    meta: "Tomorrow 9:20 AM",
    tone: "default" as const,
  },
  {
    tag: "Work",
    title: "Re: Q1 roadmap — need your OK",
    meta: "Draft reply 90% ready",
    tone: "priority" as const,
  },
];

export function ThreadPreview() {
  return (
    <section
      id="inbox-preview"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="thread-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Inbox clarity
        </p>
        <h2
          id="thread-heading"
          className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Sort your family inbox by urgency and topic
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          A scannable ledger-style view—built for messages, approvals, and follow-ups instead of
          transactions.
        </p>
        <ul className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-card border border-border bg-surface-muted/40 shadow-card">
          {threads.map((t) => (
            <li key={t.title}>
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/45">
                    {t.tag}
                  </p>
                  <p className="mt-1 truncate font-medium text-primary">{t.title}</p>
                  <p className="mt-0.5 text-sm text-primary/60">{t.meta}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    t.tone === "priority"
                      ? "border border-accent/40 bg-accent/15 text-primary"
                      : "bg-primary/5 text-primary/70"
                  }`}
                >
                  {t.tone === "priority" ? "Needs you" : "Queued"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
