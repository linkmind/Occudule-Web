import { SectionHeader } from "@/components/SectionHeader";

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
];

export function FaqSection() {
  return (
    <section id="faq" className="section-gradient py-section" aria-labelledby="faq-heading">
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader
            label="FAQ"
            title="Got questions? We've got answers."
            titleId="faq-heading"
          />
        </div>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 glass-card">
          {faqs.map((item, index) => (
            <details key={item.q} className="group px-5 py-1 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-medium tabular-nums text-white/40">
                    [ {String(index + 1).padStart(2, "0")} ]
                  </span>
                  <span>{item.q}</span>
                </span>
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-lg leading-none text-white/50 transition group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pb-4 pl-12 text-sm leading-relaxed text-white/55">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
