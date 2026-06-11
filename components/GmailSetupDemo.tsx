"use client";

import { PhoneDemoCarousel } from "@/components/PhoneDemoCarousel";

const GMAIL_DEMO_IMAGES = [
  {
    src: "/how-it-works/gmail-demo/1.png",
    alt: "Gmail setup demo step 1 — open Gmail settings",
  },
  {
    src: "/how-it-works/gmail-demo/2.png",
    alt: "Gmail setup demo step 2 — add Occudule forwarding contact",
  },
  {
    src: "/how-it-works/gmail-demo/3.png",
    alt: "Gmail setup demo step 3 — forward a child-related email",
  },
  {
    src: "/how-it-works/gmail-demo/4.png",
    alt: "Gmail setup demo step 4 — confirm forwarding options",
  },
  {
    src: "/how-it-works/gmail-demo/5.png",
    alt: "Gmail setup demo step 5 — review forwarded message",
  },
  {
    src: "/how-it-works/gmail-demo/6.png",
    alt: "Gmail setup demo step 6 — Occudule receives the email",
  },
] as const;

type GmailSetupDemoProps = {
  layout?: "compact" | "full";
  title?: string;
  body?: string;
};

export function GmailSetupDemo({
  layout = "compact",
  title,
  body,
}: GmailSetupDemoProps) {
  return (
    <PhoneDemoCarousel
      images={GMAIL_DEMO_IMAGES}
      dialogTitle="Gmail setup demo"
      dialogLabel="For Gmail users"
      triggerAriaLabel="Open Gmail setup demo"
      layout={layout}
      title={title}
      body={body}
      triggerAccent="For Gmail users"
      triggerHeading="View setup demo"
      triggerHint="6-step walkthrough — click to open the interactive demo"
    />
  );
}
