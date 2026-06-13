"use client";

import { PhoneDemoCarousel } from "@/components/PhoneDemoCarousel";

const REMINDERS_DEMO_IMAGES = [
  {
    src: "/how-it-works/reminders/14.png",
    alt: "Proactive reminders demo step 1 — upcoming event alert",
  },
  {
    src: "/how-it-works/reminders/15.png",
    alt: "Proactive reminders demo step 2 — deadline notification",
  },
] as const;

type RemindersDemoProps = {
  layout?: "compact" | "full";
  title?: string;
  body?: string;
};

export function RemindersDemo({
  layout = "compact",
  title,
  body,
}: RemindersDemoProps) {
  return (
    <PhoneDemoCarousel
      images={REMINDERS_DEMO_IMAGES}
      dialogTitle="Proactive reminders demo"
      dialogLabel="Automated execution"
      triggerAriaLabel="Open proactive reminders demo"
      layout={layout}
      title={title}
      body={body}
    />
  );
}
