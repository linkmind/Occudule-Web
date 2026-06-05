import Image from "next/image";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/SectionHeader";

/**
 * Drop feature artwork into `public/features/` using these filenames, then set `imageSrc` on each item.
 * Expected files:
 *   feature-family-emails.png
 *   feature-email-analysis.jpg
 *   feature-task-management.jpg
 *   feature-family-hub.png
 *   feature-auto-draft.png
 *   feature-conflict-detection.png
 */
type Feature = {
  id: string;
  imageSrc?: string;
  illustration?: ReactNode;
  imageAlt: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    id: "family-emails",
    imageSrc: "/features/feature-family-emails.jpg",
    imageAlt: "Illustration for family email optimization",
    title: "Optimized specially for family emails",
    description:
      "An AI engine configured with specialized workflows to instantly recognize and prioritize child-related emails, school announcements, and youth activities.",
  },
  {
    id: "email-analysis",
    imageSrc: "/features/feature-email-analysis.jpg",
    imageAlt: "Illustration for smart email analysis and extraction",
    title: "Smart email analysis & extraction",
    description:
      "Instantly analyzes incoming messages to extract key dates, locations, and action items, cleanly categorizing them so nothing gets lost in the noise.",
  },
  {
    id: "task-management",
    imageSrc: "/features/feature-task-management.jpg",
    imageAlt: "Illustration for automated task management and reminders",
    title: "Automated task management & reminders",
    description:
      "Instantly converts incoming emails into structured to-do lists, calendar events, and reference info cards with reminders that keep your household on track.",
  },
  {
    id: "family-hub",
    imageSrc: "/features/feature-family-hub.png",
    imageAlt: "Illustration for the family co-working hub",
    title: "Family co-working hub",
    description:
      "A unified digital workspace that enables parents and family members to collaborate, share the mental load, and coordinate logistics in real time.",
  },
  {
    id: "auto-draft",
    imageSrc: "/features/feature-auto-draft.png",
    imageAlt: "Illustration for intelligent auto-draft replies",
    title: "Intelligent auto-draft replies",
    description:
      "Saves time with smart, context-aware email responses drafted automatically and ready for you to review and send with a single tap.",
  },
  {
    id: "conflict-detection",
    imageSrc: "/features/feature-conflict-detection.png",
    imageAlt: "Illustration for smart conflict detection",
    title: "Smart conflict detection",
    description:
      "Scans family schedules in real time to instantly detect overlapping activities and time conflicts before they become scheduling nightmares.",
  },
];

function FeatureImageSlot({
  imageSrc,
  illustration,
  imageAlt,
  layout,
}: {
  imageSrc?: string;
  illustration?: ReactNode;
  imageAlt: string;
  layout: "horizontal" | "vertical";
}) {
  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={`relative overflow-hidden bg-[#050d18] ${
        isHorizontal
          ? "min-h-[200px] w-full sm:min-h-full sm:w-[45%] sm:shrink-0 sm:self-stretch sm:border-r sm:border-white/5"
          : "aspect-[16/10] w-full border-b border-white/5"
      }`}
    >
      <div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-2xl"
        aria-hidden
      />
      {illustration ? (
        <div
          className={`relative flex h-full min-h-[inherit] w-full items-center justify-center ${
            isHorizontal ? "px-4 py-5 sm:px-5" : "p-5"
          }`}
          role="img"
          aria-label={imageAlt}
        >
          {illustration}
        </div>
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          unoptimized={process.env.NODE_ENV === "development"}
          className={
            isHorizontal
              ? "origin-center scale-[1.15] object-contain object-center p-2 sm:scale-[1.2]"
              : "object-contain p-4"
          }
          sizes={
            isHorizontal
              ? "(max-width: 640px) 100vw, 24vw"
              : "(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 25vw"
          }
        />
      ) : (
        <div
          className="relative flex h-full min-h-[inherit] w-full items-center justify-center p-6"
          aria-hidden
        >
          <div className="h-full min-h-[140px] w-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] sm:min-h-[160px]" />
        </div>
      )}
    </div>
  );
}

function FeatureCard({
  feature,
  layout,
}: {
  feature: Feature;
  layout: "horizontal" | "vertical";
}) {
  const isHorizontal = layout === "horizontal";

  return (
    <article
      className={`flex h-full overflow-hidden rounded-2xl border border-white/10 bg-[#07101c]/90 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] ${
        isHorizontal ? "min-h-[240px] flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <FeatureImageSlot
        imageSrc={feature.imageSrc}
        illustration={feature.illustration}
        imageAlt={feature.imageAlt}
        layout={layout}
      />
      <div
        className={`flex flex-1 flex-col justify-center ${
          isHorizontal ? "p-6 md:p-7" : "p-5 md:p-6"
        }`}
      >
        <h3
          className={`font-semibold tracking-tight text-white ${
            isHorizontal ? "text-lg md:text-xl" : "text-base md:text-[1.05rem]"
          }`}
        >
          {feature.title}
        </h3>
        <p
          className={`mt-2.5 flex-1 leading-relaxed text-white/55 ${
            isHorizontal ? "text-sm md:text-[0.95rem]" : "text-sm"
          }`}
        >
          {feature.description}
        </p>
      </div>
    </article>
  );
}

export function Features() {
  const [topRow, ...bottomRow] = features;

  return (
    <section id="features" className="section-dark py-section" aria-labelledby="features-heading">
      <div className="mesh-overlay opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader
            label="CORE FEATURES"
            title="Purpose-built modules that turn family email into action"
            titleId="features-heading"
          />
        </div>

        <div className="relative mt-14 space-y-3.5">
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            <FeatureCard feature={topRow} layout="horizontal" />
            <FeatureCard feature={bottomRow[0]} layout="horizontal" />
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {bottomRow.slice(1).map((feature) => (
              <FeatureCard key={feature.id} feature={feature} layout="vertical" />
            ))}
          </div>

          <div
            className="pointer-events-none absolute -bottom-2 right-0 hidden text-accent/40 lg:block"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2l1.4 6.6L20 10l-6.6 1.4L12 18l-1.4-6.6L4 10l6.6-1.4L12 2z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
