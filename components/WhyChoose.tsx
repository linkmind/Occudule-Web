const pillars = [
  {
    title: "Everything in one centralized space",
    body: "Forget the old routine of opening an email, manually creating a calendar event, copying notes into a separate app, typing out reminders, and holding stressful family meetings to sync schedules. Occudule replaces the chaos, handling your entire workflow in one beautiful, cohesive experience.",
  },
  {
    title: "Built with a privacy-first mindset",
    body: "We respect your personal data. To minimize data collection, Occudule extracts only the essential logistics and action items rather than storing your entire email history. Backed by strict internal data management policies, we ensure full compliance with modern data regulations to keep your information safe.",
  },
  {
    title: "Made by parents, for parents",
    body: 'We lived the exact same daily logistical chaos you are experiencing. Grounded in our core philosophy—"Made by parents, for parents"—we engineered Occudule with deep empathy and a singular goal: to eliminate the mental burden of family logistics.',
  },
  {
    title: "Optimized specially for school & extracurriculars",
    body: "Unlike generic AI tools, Occudule's specialized workflows are purpose-built to navigate the unique nuances of school announcements, permission slips, sports leagues, and after-school programs.",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why-occudule"
      className="border-b border-border bg-surface-muted py-section"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Why choose Occudule
        </p>
        <h2
          id="why-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Built for the way families actually manage email
        </h2>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {pillars.map((item) => (
            <li key={item.title}>
              <article className="h-full rounded-card border border-border bg-surface p-6 shadow-card transition hover:border-primary/15 hover:shadow-lg">
                <h3 className="text-lg font-semibold tracking-tight text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary/70">{item.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
