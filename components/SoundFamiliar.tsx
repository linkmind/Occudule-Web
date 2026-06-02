const painPoints: { lead?: string; text: string }[] = [
  { text: "Too tired to read school emails after a long workday." },
  { text: "Too long, with no time or patience to read them all." },
  {
    lead: "Manual work",
    text: "Reading emails just to copy-paste events and to-dos.",
  },
  { text: "Dropped tasks due to miscommunication with your partner." },
  {
    lead: "Forgotten chores",
    text: "Your partner constantly misses assignments you share.",
  },
];

export function SoundFamiliar() {
  return (
    <section
      className="border-b border-border bg-surface py-section"
      aria-labelledby="sound-familiar-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <h2
          id="sound-familiar-heading"
          className="text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Sound familiar?
        </h2>
        <ul className="mx-auto mt-12 max-w-2xl space-y-4">
          {painPoints.map((item) => (
            <li key={item.lead ?? item.text}>
              <article className="rounded-card border border-border bg-surface-muted/60 px-5 py-4 shadow-card sm:px-6">
                <p className="text-base leading-relaxed text-primary/80">
                  {item.lead ? (
                    <>
                      <span className="font-semibold text-primary">{item.lead}:</span>{" "}
                      {item.text}
                    </>
                  ) : (
                    item.text
                  )}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
