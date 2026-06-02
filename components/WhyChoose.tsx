import { SectionHeader } from "@/components/SectionHeader";

const pillars = [
  {
    label: "ONE HUB",
    title: "Everything in one centralized space",
    body: "Forget the old routine of opening an email, manually creating a calendar event, copying notes into a separate app, typing out reminders, and holding stressful family meetings to sync schedules. Occudule replaces the chaos, handling your entire workflow in one beautiful, cohesive experience.",
  },
  {
    label: "PRIVACY FIRST",
    title: "Built with a privacy-first mindset",
    body: "We respect your personal data. To minimize data collection, Occudule extracts only the essential logistics and action items rather than storing your entire email history. Backed by strict internal data management policies, we ensure full compliance with modern data regulations to keep your information safe.",
  },
  {
    label: "BY PARENTS",
    title: "Made by parents, for parents",
    body: 'We lived the exact same daily logistical chaos you are experiencing. Grounded in our core philosophy—"Made by parents, for parents"—we engineered Occudule with deep empathy and a singular goal: to eliminate the mental burden of family logistics.',
  },
  {
    label: "SCHOOL READY",
    title: "Optimized specially for school & extracurriculars",
    body: "Unlike generic AI tools, Occudule's specialized workflows are purpose-built to navigate the unique nuances of school announcements, permission slips, sports leagues, and after-school programs.",
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
