import { SectionHeader } from "@/components/SectionHeader";

const features = [
  {
    title: "Optimized specially for family emails",
    description:
      "An AI engine configured with specialized workflows for school and extracurriculars.",
    gradient: "from-primary via-primary/80 to-accent/30",
  },
  {
    title: "Smart email analysis & extraction",
    description:
      "Extracts key dates, locations, and action items from messages so nothing gets lost.",
    gradient: "from-accent/40 via-primary to-success/20",
  },
  {
    title: "Automated task management & reminders",
    description:
      "Converts emails into structured to-do lists, calendar events, and helpful reminders",
    gradient: "from-success/30 via-primary to-accent/20",
  },
  {
    title: "Family co-working hub",
    description:
      "A shared digital workspace for family members to coordinate logistics and share the mental load.",
    gradient: "from-primary to-background-elevated",
  },
  {
    title: "Intelligent auto-draft replies",
    description:
      "Automatically drafts context-aware email responses ready to send with a single tap.",
    gradient: "from-accent/25 via-primary to-primary",
  },
  {
    title: "Smart conflict detection",
    description:
      "Scans schedules in real time to catch overlapping activities before they cause issues.",
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
            title="Purpose-built modules that turn family email into action"
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
