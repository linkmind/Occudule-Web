"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

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
    name: "Premium",
    tagline: "Perfect for growing families",
    yearly: {
      price: "$69.99",
      period: "/yr",
      detail: "Billed at $69.99/yr",
      saveBadge: null,
    },
    monthly: {
      price: "$6.99",
      period: "/mo",
      detail: "Only $6.99/mo",
      saveBadge: null,
    },
  },
  diamond: {
    shortLabel: "Diam.",
    name: "Diamond",
    tagline: "Perfect for busy households",
    yearly: {
      price: "$89.99",
      period: "/yr",
      detail: "Only $7.49/mo",
      saveBadge: "SAVE 19%",
    },
    monthly: {
      price: "$8.99",
      period: "/mo",
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
      <span className="text-white/30" aria-label="Not included">
        —
      </span>
    );
  }
  return <span className="font-medium text-white/90">{value}</span>;
}

export function PricingSection() {
  const [tier, setTier] = useState<PlanTier>("premium");
  const [billing, setBilling] = useState<Billing>("yearly");

  const selectedPlan = planPricing[tier];
  const activeOption = selectedPlan[billing];
  const planColumnLabel = selectedPlan.shortLabel;

  return (
    <section id="pricing" className="section-dark py-section" aria-labelledby="pricing-heading">
      <div className="mesh-overlay opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader
            label="PRICING"
            title="Plans that grow with your family"
            titleId="pricing-heading"
          />
          <p className="mx-auto mt-4 text-xs text-white/45">All prices are in USD.</p>
        </div>

        <div className="mx-auto mt-10 flex max-w-xs justify-center">
          <div
            className="flex w-full rounded-full border border-white/10 bg-white/5 p-1"
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
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-xs justify-center gap-2">
          {(["yearly", "monthly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setBilling(period)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                billing === period
                  ? "bg-accent/20 text-accent"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {period}
              {period === "yearly" && tier === "diamond" ? (
                <span className="ml-1 text-xs text-success">-15%</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <article className="glass-card relative overflow-hidden p-8 text-center">
            {activeOption.saveBadge ? (
              <span className="absolute right-4 top-4 rounded-full bg-cta px-2.5 py-0.5 text-xs font-bold text-white">
                {activeOption.saveBadge}
              </span>
            ) : null}
            <p className="text-sm font-semibold text-white/70">{selectedPlan.name}</p>
            <p className="mt-1 text-xs text-white/45">{selectedPlan.tagline}</p>
            <p className="mt-6 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-semibold tracking-tight text-white">
                {activeOption.price}
              </span>
              <span className="text-lg text-white/50">{activeOption.period}</span>
            </p>
            <p className="mt-2 text-sm text-white/50">{activeOption.detail}</p>
          </article>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-card border border-white/10 glass-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th scope="col" className="px-4 py-4 font-semibold text-white md:px-6">
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold text-white/50 md:px-6"
                  >
                    FREE
                  </th>
                  <th scope="col" className="bg-accent/10 px-4 py-4 text-center md:px-6">
                    <span className="inline-block rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
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
                      className={index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}
                    >
                      <td className="px-4 py-3.5 text-white/70 md:px-6">{row.label}</td>
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
