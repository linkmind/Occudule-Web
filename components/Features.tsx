import { SectionHeader } from "@/components/SectionHeader";

const features = [
  {
    title: "Optimized specially for family emails",
    description:
      "An AI engine configured with specialized workflows to instantly recognize and prioritize child-related emails, school announcements, and youth activities.",
    gradient: "from-primary via-primary/80 to-accent/30",
  },
  {
    title: "Smart email analysis & extraction",
    description:
      "Instantly analyzes incoming messages to extract key dates, locations, and action items, cleanly categorizing them so nothing gets lost in the noise.",
    gradient: "from-accent/40 via-primary to-success/20",
  },
  {
    title: "Automated task management & reminders",
    description:
      "Instantly converts incoming emails into structured to-do lists, calendar events, and reference info cards with reminders that keep your household on track.",
    gradient: "from-success/30 via-primary to-accent/20",
  },
  {
    title: "Family co-working hub",
    description:
      "A unified digital workspace that enables parents and family members to collaborate, share the mental load, and coordinate logistics in real time.",
    gradient: "from-primary to-background-elevated",
  },
  {
    title: "Intelligent auto-draft replies",
    description:
      "Saves time with smart, context-aware email responses drafted automatically and ready for you to review and send with a single tap.",
    gradient: "from-accent/25 via-primary to-primary",
  },
  {
    title: "Smart conflict detection",
    description:
      "Scans family schedules in real time to instantly detect overlapping activities and time conflicts before they become scheduling nightmares.",
    gradient: "from-cta/20 via-primary to-accent/15",
  },
];

function FeatureCard({
  feature,
  large = false,
}: {
  feature: (typeof features)[0];
  large?: boolean;
}) {
  return (
    <article className={`glass-card-hover overflow-hidden ${large ? "sm:flex sm:flex-row" : "flex flex-col"}`}>
      <div
        className={`relative shrink-0 bg-gradient-to-br ${feature.gradient} ${
          large ? "aspect-[16/10] w-full sm:aspect-auto sm:w-2/5 sm:min-h-[200px]" : "aspect-[16/10] w-full"
        }`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgb(103_232_249/0.25),transparent_55%)]" />
      </div>
      <div className={`flex flex-col justify-center p-5 md:p-6 ${large ? "sm:flex-1" : ""}`}>
        <h3 className="text-base font-semibold text-white md:text-lg">{feature.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{feature.description}</p>
      </div>
    </article>
  );
}

export function Features() {
  const [featured, ...rest] = features;

  return (
    <section id="features" className="section-dark py-section" aria-labelledby="features-heading">
      <div className="mesh-overlay opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader
            label="CORE FEATURES"
            title="Purpose-built modules that turn family email into action—without a complicated dashboard."
            titleId="features-heading"
          />
        </div>

        <div className="mt-14 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <FeatureCard feature={featured} large />
            <FeatureCard feature={rest[0]} large />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(1).map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
