import { SectionHeader } from "@/components/SectionHeader";

const values = [
  {
    label: "TRUST",
    title: "Integrity & Excellence",
    body: "Do the right things, and do them right.",
    highlight: "Built on trust",
  },
  {
    label: "FAMILIES",
    title: "Community-Minded",
    body: "Building solutions that uplift and connect families.",
    highlight: "Families first",
  },
  {
    label: "INNOVATION",
    title: "Tech-Savvy",
    body: "Embracing modern innovation to solve real-world parenting challenges.",
    highlight: "Innovation with purpose",
  },
];

export function AboutValuesGrid() {
  return (
    <section
      className="section-dark py-section"
      aria-labelledby="about-values-heading"
    >
      <div className="mesh-overlay opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader
            label="OUR VALUES"
            title="What guides us"
            titleId="about-values-heading"
          />
        </div>
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <li key={item.title}>
              <article className="glass-card-hover flex h-full flex-col p-6 md:p-8">
                <p className="text-xs font-medium tracking-wide text-accent/80">
                  [ {item.label} ]
                </p>
                <p className="mt-2 text-xs font-semibold text-cta">{item.highlight}</p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{item.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
