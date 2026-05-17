const steps = [
  {
    step: "1",
    title: "Connect your inbox securely",
    body: "Link the accounts where family logistics actually land—Gmail, Outlook, and more as we expand.",
  },
  {
    step: "2",
    title: "Let Occudule organize the noise",
    body: "We sort threads by urgency, extract dates, and prep summaries so you scan in seconds.",
  },
  {
    step: "3",
    title: "Reply in your voice—faster",
    body: "Edit AI drafts that match your tone, send with confidence, and get time back every week.",
  },
];

function StepVisual({ variant }: { variant: 1 | 2 | 3 }) {
  const bars =
    variant === 1
      ? [40, 65, 45, 80, 55, 90]
      : variant === 2
        ? [70, 50, 85, 60, 75, 55]
        : [55, 75, 65, 70, 50, 85];

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-gradient-to-br from-primary to-primary/90 p-6 text-surface shadow-card"
      aria-hidden
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>This week</span>
        <span className="rounded-full bg-success/20 px-2 py-0.5 font-medium text-success">
          −38% time
        </span>
      </div>
      <div className="mt-6 flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-accent/40 to-accent"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-6 space-y-2 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
        <div className="h-2 w-3/4 rounded bg-white/20" />
        <div className="h-2 w-1/2 rounded bg-white/15" />
        <div className="h-2 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}

export function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="steps-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Three steps
        </p>
        <h2
          id="steps-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          See how Occudule works in three simple steps
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Connect, organize, and respond—without living inside your inbox.
        </p>

        <ol className="mt-16 space-y-20 md:space-y-24">
          {steps.map((s, i) => (
            <li key={s.step}>
              <div
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Step — {s.step}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-primary md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-primary/75">{s.body}</p>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <StepVisual variant={(i + 1) as 1 | 2 | 3} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
