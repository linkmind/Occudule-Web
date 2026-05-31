export function AboutNarrativeBlock() {
  return (
    <section
      className="border-b border-border bg-surface-muted py-section"
      aria-labelledby="about-company-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Our company
            </p>
            <h2
              id="about-company-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-primary md:text-3xl"
            >
              Outvblue Technology Inc.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-primary/75 md:text-lg">
              <strong className="font-semibold text-primary">Outvblue Technology Inc.</strong> is an
              Ontario-based technology company founded and run entirely by parents. Grounded in our
              core philosophy—<em>Made by parents, for parents</em>—we harness innovative tech to
              help families thrive, beautifully balancing life at home and out in the world.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Our product
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-primary md:text-3xl">
              Occudule
            </h2>
            <p className="mt-5 text-base leading-relaxed text-primary/75 md:text-lg">
              Our flagship product, <strong className="font-semibold text-primary">Occudule</strong>,
              was born from a desire to clear the digital clutter of modern parenting. It helps busy
              parents effortlessly stay on top of school and extracurricular logistics by automating
              the entire workflow.
            </p>
            <p className="mt-4 text-base leading-relaxed text-primary/75 md:text-lg">
              Occudule seamlessly handles email processing, extracts key details, generates to-do
              lists, manages intelligent auto-replies, detects scheduling conflicts, and coordinates
              task assignments between family members.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-14 max-w-2xl text-center text-xl font-semibold tracking-tight text-primary md:text-2xl">
          We take care of the mental load, so you can focus on what matters most.
        </p>
      </div>
    </section>
  );
}
