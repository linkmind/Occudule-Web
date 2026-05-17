const faqs = [
  {
    q: "How does Occudule connect to my email?",
    a: "You authorize read access through standard OAuth providers (e.g. Google or Microsoft). We sync threads to prioritize and draft—never to sell your data.",
  },
  {
    q: "Will Occudule send emails without me?",
    a: "No. Drafts stay in your control—you review, edit, and hit send. Future automation will always be opt-in with clear previews.",
  },
  {
    q: "Can I use Occudule for work and family together?",
    a: "Yes. Many parents route both into Occudule with topic-aware separation so work never buries a school deadline (and vice versa).",
  },
  {
    q: "How do you handle children’s information in school threads?",
    a: "We treat minors’ data with extra care: minimization, retention limits, and settings to exclude specific senders or domains from AI processing.",
  },
  {
    q: "When will pricing go live?",
    a: "Waitlist members get early access first, with founding rates. Final numbers will be published before billing begins.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Got questions? We&apos;ve got answers.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Straightforward details so you can decide if Occudule fits your household.
        </p>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-card border border-border bg-surface-muted/30">
          {faqs.map((item, index) => (
            <details key={item.q} className="group px-5 py-1 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm font-bold text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.q}</span>
                </span>
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-lg leading-none text-primary/50 transition group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pb-4 pl-9 text-sm leading-relaxed text-primary/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
