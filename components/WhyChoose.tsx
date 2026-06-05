import { SectionHeader } from "@/components/SectionHeader";

const pillars = [
  {
    label: "ONE HUB",
    title: "Everything in one centralized space",
    body: "Forget the chaos of jumping between emails, calendars, notes, and reminders. Occudule replaces the old, scattered routine by handling your entire workflow in one beautiful, cohesive experience.",
  },
  {
    label: "PRIVACY FIRST",
    title: "Built with a privacy-first mindset",
    body: "We respect your personal data. Instead of storing your entire email history, Occudule extracts only the essential logistics and action items. Backed by strict internal management and full regulatory compliance.",
  },
  {
    label: "BY PARENTS",
    title: "Made by parents, for parents",
    body: 'We lived the same chaotic routine you are experiencing. Engineered with deep empathy, Occudule was built with a single goal: to completely eliminate the mental burden of family logistics.',
  },
  {
    label: "SCHOOL READY",
    title: "Optimized specially for school & extracurriculars",
    body: "Unlike generic AI tools, Occudule is purpose-built to navigate the unique nuances of school announcements, permission slips, sports leagues, and after-school programs.",
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
