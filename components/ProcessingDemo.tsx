"use client";

import { InlinePhoneCarousel } from "@/components/InlinePhoneCarousel";

const PROCESSING_DEMO_IMAGES = [
  {
    src: "/how-it-works/intelligent-processing/7.png",
    alt: "Intelligent processing demo step 1",
  },
  {
    src: "/how-it-works/intelligent-processing/8.png",
    alt: "Intelligent processing demo step 2",
  },
  {
    src: "/how-it-works/intelligent-processing/9.png",
    alt: "Intelligent processing demo step 3",
  },
  {
    src: "/how-it-works/intelligent-processing/10.png",
    alt: "Intelligent processing demo step 4",
  },
] as const;

export function ProcessingDemo() {
  return (
    <InlinePhoneCarousel
      images={PROCESSING_DEMO_IMAGES}
      label="Intelligent processing demo"
    />
  );
}
