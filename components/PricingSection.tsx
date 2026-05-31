"use client";

import { useMemo, useState } from "react";
import { CtaButton } from "@/components/CtaButton";

type PlanTier = "premium" | "diamond";
type Billing = "yearly" | "monthly";

type FeatureValue = "check" | "none" | string;

type FeatureRow = {
  label: string;
  free: FeatureValue;
  premium: FeatureValue;
  diamond: FeatureValue;
};

const featureRows: FeatureRow[] = [
  { label: "AI-extracted to-dos", free: "check", premium: "check", diamond: "check" },
  { label: "Family Group", free: "check", premium: "check", diamond: "check" },
  { label: "# of email processing", free: "8", premium: "Unlimited", diamond: "Unlimited" },
  { label: "# of child Account", free: "1", premium: "2", diamond: "4" },
  { label: "# of school per child", free: "1", premium: "1", diamond: "1" },
  { label: "Sender whitelist email", free: "3", premium: "10", diamond: "Unlimited" },
  { label: "Time conflict detection", free: "none", premium: "check", diamond: "check" },
  { label: "Calendar Integration", free: "none", premium: "check", diamond: "check" },
  { label: "# of institution per child", free: "none", premium: "3", diamond: "6" },
  { label: "AI-drafted email reply", free: "none", premium: "none", diamond: "check" },
];

const planPricing = {
  premium: {
    shortLabel: "Prem.",
    yearly: {
      price: "$69.99/yr",
      detail: "Billed at $69.99/yr",
      saveBadge: null,
    },
    monthly: {
      price: "$6.99/mo",
      detail: "Only $6.99/mo",
      saveBadge: null,
    },
  },
  diamond: {
    shortLabel: "Diam.",
    yearly: {
      price: "$89.99/yr",
      detail: "Only $7.49/mo",
      saveBadge: "SAVE 19%",
    },
    monthly: {
      price: "$8.99/mo",
      detail: "Billed at $8.99/mo",
      saveBadge: null,
    },
  },
} as const;

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === "check") {
    return (
      <span className="inline-flex text-success" aria-label="Included">
        ✓
      </span>
    );
  }
  if (value === "none") {
    return (
      <span className="text-primary/35" aria-label="Not included">
        —
      </span>
    );
  }
  return <span className="font-medium text-primary">{value}</span>;
}

export function PricingSection() {
  const [tier, setTier] = useState<PlanTier>("premium");
  const [billing, setBilling] = useState<Billing>("yearly");

  const selectedPlan = planPricing[tier];
  const billingOptions = useMemo(
    () =>
      (["yearly", "monthly"] as const).map((period) => ({
        period,
        ...selectedPlan[period],
      })),
    [selectedPlan],
  );

  const planColumnLabel = selectedPlan.shortLabel;

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
          Plans that grow with your family
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Start free, then upgrade to Premium or Diamond when you need more capacity and automation.
        </p>
        <p className="mx-auto mt-2 text-center text-xs text-primary/50">
          All prices are in USD.
        </p>

        <div className="mx-auto mt-10 max-w-xl">
          <div
            className="flex rounded-full border border-border bg-surface-muted p-1"
            role="group"
            aria-label="Plan tier"
          >
            {(["premium", "diamond"] as const).map((plan) => (
              <button
                key={plan}
                type="button"
                onClick={() => setTier(plan)}
                className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition ${
                  tier === plan
                    ? "bg-primary text-surface shadow-sm"
                    : "text-primary/60 hover:text-primary"
                }`}
              >
                {plan}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {billingOptions.map((option) => {
              const selected = billing === option.period;
              return (
                <button
                  key={`${tier}-${option.period}`}
                  type="button"
                  onClick={() => setBilling(option.period)}
                  className={`relative rounded-card border p-5 text-left transition ${
                    selected
                      ? "border-primary bg-surface shadow-card ring-2 ring-primary/10"
                      : "border-border bg-surface-muted/50 hover:border-primary/20"
                  }`}
                  aria-pressed={selected}
                >
                  {option.saveBadge ? (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-surface">
                      {option.saveBadge}
                    </span>
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold capitalize text-primary">
                        {option.period}
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
                        {option.price}
                      </p>
                      <p className="mt-1 text-sm text-primary/60">{option.detail}</p>
                    </div>
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-primary bg-primary text-surface"
                          : "border-border bg-surface"
                      }`}
                      aria-hidden
                    >
                      {selected ? "✓" : ""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <CtaButton href="/waitlist" size="lg">
              Join the waitlist
            </CtaButton>
          </div>
          <p className="mt-3 text-center text-xs text-primary/50">
            Subscriptions are available in the Occudule app via Apple App Store and Google Play.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-card border border-border shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th scope="col" className="px-4 py-4 font-semibold text-primary md:px-6">
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold text-primary/70 md:px-6"
                  >
                    FREE
                  </th>
                  <th
                    scope="col"
                    className="bg-accent/10 px-4 py-4 text-center md:px-6"
                  >
                    <span className="inline-block rounded-full bg-gradient-to-r from-accent to-success px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {planColumnLabel}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, index) => {
                  const planValue = row[tier];
                  return (
                    <tr
                      key={row.label}
                      className={index % 2 === 0 ? "bg-surface" : "bg-surface-muted/40"}
                    >
                      <td className="px-4 py-3.5 text-primary/80 md:px-6">{row.label}</td>
                      <td className="px-4 py-3.5 text-center md:px-6">
                        <FeatureCell value={row.free} />
                      </td>
                      <td className="bg-accent/5 px-4 py-3.5 text-center md:px-6">
                        <FeatureCell value={planValue} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
