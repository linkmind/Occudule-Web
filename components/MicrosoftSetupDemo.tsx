"use client";

import { PhoneDemoCarousel } from "@/components/PhoneDemoCarousel";

const MICROSOFT_DEMO_IMAGES = [
  {
    src: "/how-it-works/microsoft-demo/1.png",
    alt: "Microsoft setup demo step 1 — open Outlook settings",
  },
  {
    src: "/how-it-works/microsoft-demo/2.png",
    alt: "Microsoft setup demo step 2 — connect your Microsoft account",
  },
  {
    src: "/how-it-works/microsoft-demo/11.png",
    alt: "Microsoft setup demo step 3 — authorize Occudule access",
  },
  {
    src: "/how-it-works/microsoft-demo/12.png",
    alt: "Microsoft setup demo step 4 — confirm account connection",
  },
  {
    src: "/how-it-works/microsoft-demo/13.png",
    alt: "Microsoft setup demo step 5 — Occudule scans incoming messages",
  },
] as const;

type MicrosoftSetupDemoProps = {
  layout?: "compact" | "full";
  title?: string;
  body?: string;
};

export function MicrosoftSetupDemo({
  layout = "compact",
  title,
  body,
}: MicrosoftSetupDemoProps) {
  return (
    <PhoneDemoCarousel
      images={MICROSOFT_DEMO_IMAGES}
      dialogTitle="Microsoft setup demo"
      dialogLabel="For Microsoft users"
      triggerAriaLabel="Open Microsoft setup demo"
      layout={layout}
      title={title}
      body={body}
    />
  );
}
