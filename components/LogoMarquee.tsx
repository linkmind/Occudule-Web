const partners = [
  "Northfield PTA",
  "Harbor Pediatrics",
  "Little League 12U",
  "Remote Work Co.",
  "Sunrise Daycare",
  "Maple Ridge Schools",
  "City Youth Soccer",
  "Parent Council ON",
];

export function LogoMarquee() {
  const track = [...partners, ...partners];

  return (
    <section
      className="border-b border-border bg-surface py-8"
      aria-label="Communities and teams"
    >
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-primary/45">
        Built for households and communities like yours
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent" />
        <div className="flex w-max gap-16 animate-marquee">
          {track.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-sm font-semibold tracking-tight text-primary/35"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
