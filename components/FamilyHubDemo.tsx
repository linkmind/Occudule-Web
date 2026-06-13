"use client";

import { PhoneDemoCarousel } from "@/components/PhoneDemoCarousel";

const FAMILY_HUB_DEMO_IMAGES = [
  {
    src: "/how-it-works/family_hub/16.png",
    alt: "Family hub demo step 1 — unified household calendar",
  },
  {
    src: "/how-it-works/family_hub/17.png",
    alt: "Family hub demo step 2 — shared events and logistics in one place",
  },
] as const;

type FamilyHubDemoProps = {
  layout?: "compact" | "full";
  title?: string;
  body?: string;
};

export function FamilyHubDemo({
  layout = "compact",
  title,
  body,
}: FamilyHubDemoProps) {
  return (
    <PhoneDemoCarousel
      images={FAMILY_HUB_DEMO_IMAGES}
      dialogTitle="Family hub demo"
      dialogLabel="Automated execution"
      triggerAriaLabel="Open family hub demo"
      layout={layout}
      title={title}
      body={body}
    />
  );
}
