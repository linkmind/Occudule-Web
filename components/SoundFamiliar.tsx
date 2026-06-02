"use client";

import { useEffect, useRef, useState } from "react";

type PainPoint = {
  id: string;
  line1: string;
  line2: string;
  position: string;
};

const painPoints: PainPoint[] = [
  {
    id: "tired",
    line1: "Too tired to read",
    line2: "school emails after a long workday.",
    position: "top-[32%] left-[4%] md:left-[7%]",
  },
  {
    id: "long",
    line1: "Too long, with no time",
    line2: "or patience to read them all.",
    position: "bottom-[38%] right-[2%] md:right-[5%]",
  },
  {
    id: "manual",
    line1: "Manual work:",
    line2: "Reading emails just to copy-paste events and to-dos.",
    position: "top-[14%] left-[18%] md:left-[22%]",
  },
  {
    id: "dropped",
    line1: "Dropped tasks due to",
    line2: "miscommunication with your partner.",
    position: "bottom-[12%] right-[2%] md:right-[4%]",
  },
  {
    id: "forgotten",
    line1: "Forgotten chores:",
    line2: "Your partner constantly misses assignments you share.",
    position: "top-[52%] left-[6%] md:left-[10%]",
  },
];

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="none"
      className={`absolute h-2 w-2 text-white ${className}`}
      aria-hidden
    >
      <path d="M12 0H0V12" stroke="currentColor" />
    </svg>
  );
}

function PainPointCard({
  point,
  active,
}: {
  point: PainPoint;
  active: boolean;
}) {
  return (
    <div
      className={`relative mx-auto max-w-[300px] text-center transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-[0.09]"
      }`}
    >
      <div className="relative px-4 py-3">
        <CornerOrnament className="left-0 top-0" />
        <p className="text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl">
          {point.line1}
          <br />
          {point.line2}
        </p>
        <CornerOrnament className="bottom-0 right-0 rotate-180" />
      </div>
      <div
        className={`pointer-events-none absolute inset-0 backdrop-blur-[4px] transition-opacity duration-500 ${
          active ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden
      />
    </div>
  );
}

export function SoundFamiliar() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = items.indexOf(entry.target as HTMLDivElement);
          if (idx >= 0) setActiveIndex(idx);
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative border-b border-white/10 bg-primary"
      aria-labelledby="sound-familiar-heading"
    >
      <div className="z-10 flex items-center justify-center px-gutter py-14 md:sticky md:top-0 md:h-screen md:py-0 pointer-events-none">
        <h2
          id="sound-familiar-heading"
          className="bg-gradient-to-br from-white from-[20%] to-accent to-[65%] bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent md:text-5xl lg:text-6xl"
        >
          Sound familiar?
        </h2>
      </div>

      {/* Desktop: scattered scroll-reveal layout (Bima “Is This You?”) */}
      <div className="relative mx-auto hidden max-w-5xl px-gutter md:block">
        <div className="relative h-[220vh]">
          {painPoints.map((point, i) => (
            <div
              key={point.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`absolute min-h-[18vh] w-full max-w-[min(300px,42vw)] ${point.position}`}
            >
              <PainPointCard point={point} active={activeIndex === i} />
            </div>
          ))}
          <div className="h-[45%]" aria-hidden />
        </div>
      </div>

      {/* Mobile: stacked corner-bracket statements */}
      <ul className="mx-auto max-w-md space-y-10 px-gutter pb-section md:hidden">
        {painPoints.map((point) => (
          <li key={point.id}>
            <div className="relative px-4 py-3 text-center">
              <CornerOrnament className="left-0 top-0" />
              <p className="text-lg font-semibold leading-snug text-white">
                {point.line1}
                <br />
                {point.line2}
              </p>
              <CornerOrnament className="bottom-0 right-0 rotate-180" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
