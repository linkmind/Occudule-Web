"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import type { DemoImage } from "@/components/PhoneDemoCarousel";

const AUTO_ADVANCE_MS = 4500;
const DEMO_IMAGE_WIDTH = 1080;
const DEMO_IMAGE_HEIGHT = 1920;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 sm:h-5 sm:w-5"
      aria-hidden
    >
      {direction === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

type InlinePhoneCarouselProps = {
  images: readonly DemoImage[];
  label: string;
};

export function InlinePhoneCarousel({ images, label }: InlinePhoneCarouselProps) {
  const carouselId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (nextIndex: number) => {
      setPaused(true);
      setIndex((nextIndex + images.length) % images.length);
    },
    [images.length],
  );

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused, images.length]);

  return (
    <div
      className="flex flex-col items-center"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      id={carouselId}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-background/95 text-white transition hover:border-accent/40 hover:text-accent sm:h-9 sm:w-9"
          aria-label="Previous slide"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="relative aspect-[9/16] w-[200px] shrink-0 overflow-hidden sm:w-[240px]">
          <Image
            key={images[index].src}
            src={images[index].src}
            alt={images[index].alt}
            width={DEMO_IMAGE_WIDTH}
            height={DEMO_IMAGE_HEIGHT}
            className="h-full w-full object-contain object-center"
            sizes="240px"
            priority={index === 0}
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-background/95 text-white transition hover:border-accent/40 hover:text-accent sm:h-9 sm:w-9"
          aria-label="Next slide"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {images.length}
      </p>

      <div className="mt-3 flex items-center justify-center gap-2">
        {images.map((image, dotIndex) => (
          <button
            key={image.src}
            type="button"
            onClick={() => goTo(dotIndex)}
            className={`h-2 rounded-full transition ${
              dotIndex === index ? "w-6 bg-accent" : "w-2 bg-white/25 hover:bg-white/45"
            }`}
            aria-label={`Go to slide ${dotIndex + 1}`}
            aria-current={dotIndex === index ? "step" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
