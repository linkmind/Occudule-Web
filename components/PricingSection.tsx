"use client";

import { useState } from "react";
import { CtaButton } from "@/components/CtaButton";

type Billing = "monthly" | "annually";

const plans: {
  name: string;
  blurb: string;
  monthlyPrice: string;
  annualPrice: string;
  highlight?: boolean;
  features: string[];
}[] = [
  {
    name: "Early access",
    blurb: "For parents joining the first wave.",
    monthlyPrice: "Free",
    annualPrice: "Free",
    features: [
      "Waitlist onboarding",
      "Core triage & summaries",
      "Community feedback channel",
      "Standard privacy controls",
    ],
  },
  {
    name: "Family",
    blurb: "For households managing school, sports, and work mail.",
    monthlyPrice: "$12",
    annualPrice: "$10",
    highlight: true,
    features: [
      "Multi-account prioritization",
      "Drafts in your voice",
      "Deadline & form extraction",
      "Priority email support",
    ],
  },
  {
    name: "Household+",
    blurb: "For co-parents and caregivers on the same plan (coming soon).",
    monthlyPrice: "$24",
    annualPrice: "$20",
    features: [
      "Shared family workspace",
      "Caregiver-safe summaries",
      "Calendar hand-offs",
      "Dedicated onboarding",
    ],
  },
];

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section
      id="pricing"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Pricing plans
        </p>
        <h2
          id="pricing-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Where simple pricing meets calm inboxes
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Transparent tiers for families—no surprise add-ons for the basics.
        </p>

        <div
          className="mx-auto mt-10 flex w-fit items-center gap-1 rounded-full border border-border bg-surface-muted p-1"
          role="group"
          aria-label="Billing period"
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              billing === "monthly"
                ? "bg-surface text-primary shadow-sm"
                : "text-primary/55 hover:text-primary"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annually")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              billing === "annually"
                ? "bg-surface text-primary shadow-sm"
                : "text-primary/55 hover:text-primary"
            }`}
          >
            Annually
          </button>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const period =
              price === "Free" ? "" : billing === "monthly" ? "/ month" : "/ month, billed yearly";

            return (
              <li key={plan.name}>
                <article
                  className={`flex h-full flex-col rounded-card border p-8 shadow-card ${
                    plan.highlight
                      ? "border-accent/50 bg-gradient-to-b from-surface to-surface-muted ring-2 ring-accent/30"
                      : "border-border bg-surface-muted/50"
                  }`}
                >
                  <h3 className="text-lg font-semibold tracking-tight text-primary">{plan.name}</h3>
                  <p className="mt-2 text-sm text-primary/65">{plan.blurb}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-primary">{price}</span>
                    {price !== "Free" && (
                      <span className="text-sm font-medium text-primary/55">{period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-primary/50">
                    {billing === "annually" && price !== "Free"
                      ? "Per month when paid annually."
                      : price === "Free"
                        ? "During early access."
                        : "Cancel any time."}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3 text-sm text-primary/75">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-success" aria-hidden>
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {plan.highlight ? (
                      <CtaButton href="#waitlist" className="w-full justify-center" size="md">
                        Get started
                      </CtaButton>
                    ) : (
                      <CtaButton
                        href="#waitlist"
                        variant="secondary"
                        className="w-full justify-center"
                        size="md"
                      >
                        Join waitlist
                      </CtaButton>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-center text-xs text-primary/50">
          Final pricing may adjust before launch—waitlist members lock founding rates.
        </p>
      </div>
    </section>
  );
}
