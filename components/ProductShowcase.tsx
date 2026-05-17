export function ProductShowcase() {
  return (
    <section
      id="showcase"
      className="border-b border-border bg-primary py-section text-surface"
      aria-labelledby="showcase-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-accent/90">
          Product overview
        </p>
        <h2
          id="showcase-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight md:text-4xl"
        >
          Simplified email powered by intelligent features
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/70">
          Track threads, approvals, and follow-ups through tools designed for real family life—not
          enterprise complexity.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
            <h3 className="text-xl font-semibold tracking-tight">Thread volume this week</h3>
            <p className="mt-2 text-sm text-white/60">School & household vs everything else</p>
            <div className="mt-8 flex items-end gap-3">
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-[4.5rem] rounded-t-lg bg-accent"
                  style={{ height: "140px" }}
                />
                <span className="text-xs text-white/55">Priority</span>
              </div>
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-[4.5rem] rounded-t-lg bg-white/20"
                  style={{ height: "72px" }}
                />
                <span className="text-xs text-white/55">Other</span>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-success">↓ 38% time in inbox vs last week</p>
          </article>

          <article className="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
            <h3 className="text-xl font-semibold tracking-tight">Replies ready to send</h3>
            <p className="mt-2 text-sm text-white/60">Drafts accepted with light edits</p>
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/75">Accepted as-is</span>
                  <span className="font-semibold text-success">62%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[62%] rounded-full bg-success" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/75">Minor edits</span>
                  <span className="font-semibold text-accent">25%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[25%] rounded-full bg-accent" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/75">Rewritten</span>
                  <span className="font-semibold text-white/90">13%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[13%] rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
