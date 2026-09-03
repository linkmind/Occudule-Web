import type { ReactNode } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

const faqs: { q: string; a: ReactNode; text?: string }[] = [
  {
    q: "How does Occudule connect to my email?",
    a: "You authorize read access through standard OAuth providers (e.g. Google or Microsoft). We sync threads to prioritize and draft—never to sell your data.",
  },
  {
    q: "I signed in with Apple. Why is the sync email box empty?",
    text: "Sign in with Apple only creates your Occudule account. School-mail sync still needs a Gmail or Microsoft mailbox. If you used iCloud or Hide My Email, Email Account (for syncing) stays empty until you type a supported address and tap here to connect. See how to connect email after Sign in with Apple.",
    a: (
      <>
        Sign in with Apple only creates your Occudule account. School-mail sync still needs a Gmail
        or Microsoft mailbox. If you used iCloud or Hide My Email,{" "}
        <span className="text-white/70">Email Account (for syncing)</span> stays empty until you
        type a supported address and tap <span className="text-white/70">here</span> to connect. For
        the full walkthrough, see{" "}
        <Link
          href="/documentation/how-tos/how-to-connect-email-after-sign-in-with-apple"
          className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
        >
          how to connect email after Sign in with Apple
        </Link>
        .
      </>
    ),
  },
  {
    q: "Why would I need to reconnect my email account?",
    a: "Reconnect if your email session expired for security, you upgraded to Premium or Diamond (calendar sync needs extra permission), or Occudule lost its connection to Gmail or Microsoft. Until you reconnect, school-email syncing can pause.",
  },
  {
    q: "How do I reconnect my email in Occudule?",
    text: "From Home, tap Profile, then User Profile. Under Syncing | Integration, tap your linked address, complete the Google or Microsoft prompts, and syncing resumes automatically. For the full walkthrough, see how to reconnect your email account.",
    a: (
      <>
        From Home, tap Profile, then User Profile. Under Syncing | Integration, tap your linked
        address, complete the Google or Microsoft prompts, and syncing resumes automatically. For
        the full walkthrough, see{" "}
        <Link
          href="/documentation/how-tos/how-to-reconnect-email-account"
          className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
        >
          how to reconnect your email account
        </Link>
        .
      </>
    ),
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

function faqAnswerText(item: { a: ReactNode; text?: string }): string {
  if (item.text) return item.text;
  return typeof item.a === "string" ? item.a : "";
}

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerText(item),
      },
    })),
  };

  return (
    <section id="faq" className="section-gradient py-section" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 inline-block shrink-0 self-start whitespace-nowrap leading-none text-xs font-medium tabular-nums text-white/40">
                    {`[${String(index + 1).padStart(2, "0")}]`}
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
