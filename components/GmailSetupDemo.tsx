"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

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
      className="h-5 w-5"
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
  const isFull = layout === "full";
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setIndex(0);
    setPaused(false);
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    setPaused(true);
    setIndex((nextIndex + GMAIL_DEMO_IMAGES.length) % GMAIL_DEMO_IMAGES.length);
  }, []);

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, goNext, goPrev]);

  useEffect(() => {
    if (!open || paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % GMAIL_DEMO_IMAGES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [open, paused]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isFull
            ? "group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:border-accent/35 hover:bg-white/[0.08] sm:px-4 sm:py-3"
            : "group mt-4 flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-accent/35 hover:bg-white/[0.08]"
        }
        aria-haspopup="dialog"
        aria-label={isFull ? "Open Gmail setup demo" : undefined}
      >
        {isFull && title && body ? (
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-sm font-semibold text-white/90">{title}</span>
            <span className="mt-1.5 block text-sm leading-snug text-white/55">{body}</span>
          </span>
        ) : null}
        <span
          className={
            isFull
              ? "relative aspect-[9/19.5] w-[96px] shrink-0 overflow-hidden rounded-lg sm:w-[108px]"
              : "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg"
          }
        >
          <Image
            src={GMAIL_DEMO_IMAGES[0].src}
            alt=""
            fill
            className="object-contain object-center opacity-90 transition group-hover:opacity-100"
            sizes={isFull ? "108px" : "80px"}
          />
        </span>
        {!isFull ? (
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium tracking-wide text-accent">
              For Gmail users
            </span>
            <span className="mt-1 block text-sm font-semibold text-white group-hover:text-accent">
              View setup demo
            </span>
            <span className="mt-1 block text-xs text-white/50">
              6-step walkthrough — click to open the interactive demo
            </span>
          </span>
        ) : null}
        {!isFull ? (
          <span
            className="shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden
          >
            →
          </span>
        ) : null}
      </button>

      {open && portalReady
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
              role="presentation"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/80"
                aria-label="Close Gmail setup demo"
                onClick={close}
              />

              <div className="relative z-10 w-full max-w-[min(360px,calc(100vw-2rem))]">
                <button
                  type="button"
                  onClick={close}
                  className="absolute -right-2 -top-2 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cta text-xl font-bold leading-none text-white shadow-lg transition hover:brightness-110 sm:right-0 sm:top-0 sm:translate-x-1/2 sm:-translate-y-1/2"
                  aria-label="Close"
                >
                  X
                </button>

                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-background-card shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
                >
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-xs font-medium tracking-wide text-accent">
                      For Gmail users
                    </p>
                    <h3 id={titleId} className="mt-1 text-lg font-semibold text-white">
                      Gmail setup demo
                    </h3>
                    <p className="mt-1 text-sm text-white/55">
                      Step {index + 1} of {GMAIL_DEMO_IMAGES.length}
                    </p>
                  </div>

                  <div className="relative px-10 py-4 sm:px-12">
                    <div className="max-h-[58dvh] overflow-y-auto">
                      <Image
                        key={GMAIL_DEMO_IMAGES[index].src}
                        src={GMAIL_DEMO_IMAGES[index].src}
                        alt={GMAIL_DEMO_IMAGES[index].alt}
                        width={DEMO_IMAGE_WIDTH}
                        height={DEMO_IMAGE_HEIGHT}
                        className="mx-auto h-auto w-full max-w-[260px] object-contain"
                        sizes="260px"
                        priority
                      />
                    </div>

                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-background/95 text-white transition hover:border-accent/40 hover:text-accent sm:left-2"
                      aria-label="Previous step"
                    >
                      <ChevronIcon direction="left" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-background/95 text-white transition hover:border-accent/40 hover:text-accent sm:right-2"
                      aria-label="Next step"
                    >
                      <ChevronIcon direction="right" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 border-t border-white/10 px-5 py-3">
                    {GMAIL_DEMO_IMAGES.map((image, dotIndex) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => goTo(dotIndex)}
                        className={`h-2 rounded-full transition ${
                          dotIndex === index
                            ? "w-6 bg-accent"
                            : "w-2 bg-white/25 hover:bg-white/45"
                        }`}
                        aria-label={`Go to step ${dotIndex + 1}`}
                        aria-current={dotIndex === index ? "step" : undefined}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
