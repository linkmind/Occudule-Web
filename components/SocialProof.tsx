const metrics = [
  { label: "Avg. time saved / week", value: "3.2 hrs", delta: "+42%", note: "beta parents" },
  { label: "Reply drafts accepted", value: "87%", delta: "+12%", note: "with light edits" },
  { label: "Threads auto-summarized", value: "1.4k", delta: "+28%", note: "last 30 days" },
];

const logos = ["Northfield PTA", "Harbor Pediatrics", "Little League 12U", "Remote Work Co."];

export function SocialProof() {
  return (
    <section
      id="proof"
      className="border-b border-border bg-primary py-section text-surface"
      aria-labelledby="metrics-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-accent/90">
          Trusted by early families
        </p>
        <h2
          id="metrics-heading"
          className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight md:text-4xl"
        >
          Numbers that match how parents feel after one week.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-card border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <p className="text-sm text-white/70">{m.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{m.value}</p>
              <p className="mt-1 text-sm font-semibold text-success">{m.delta}</p>
              <p className="mt-2 text-xs text-white/50">{m.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/45">
            Teams & communities like yours
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-90">
            {logos.map((name) => (
              <li key={name}>
                <span className="text-sm font-medium tracking-tight text-white/80">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
