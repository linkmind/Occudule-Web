import { SectionHeader } from "@/components/SectionHeader";

const pillars = [
  {
    label: "ONE HUB",
    title: "Everything in one centralized space",
    body: "Replaces the chaos of scattered apps by handling your entire workflow in one cohesive experience.",
  },
  {
    label: "PRIVACY FIRST",
    title: "Built with a privacy-first mindset",
    body: "Keeps your data safe by extracting only essential logistics instead of storing your full history.",
  },
  {
    label: "BY PARENTS",
    title: "Made by parents, for parents",
    body: 'Built with deep empathy by parents who lived the chaos, designed to eliminate your mental burden.',
  },
  {
    label: "SCHOOL READY",
    title: "Optimized specially for school & extracurriculars",
    body: "Purpose-built to effortlessly handle the unique nuances of school schedules and extracurriculars.",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why-occudule"
      className="section-gradient py-section"
      aria-labelledby="why-heading"
    >
      <div className="mesh-overlay opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader
            label="WHY OCCUDULE"
            title="Built for the way families actually manage email"
            titleId="why-heading"
          />
        </div>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {pillars.map((item) => (
            <li key={item.title}>
              <article className="glass-card-hover h-full p-6 md:p-8">
                <p className="text-xs font-medium tracking-wide text-accent/80">
                  [ {item.label} ]
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
