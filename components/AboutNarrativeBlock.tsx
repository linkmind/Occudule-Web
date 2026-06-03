import { SectionHeader } from "@/components/SectionHeader";

export function AboutNarrativeBlock() {
  return (
    <section
      className="section-gradient py-section"
      aria-labelledby="about-company-heading"
    >
      <div className="mesh-overlay opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="mx-auto text-center">
          <SectionHeader label="OUR STORY" title="Who we are & what we build" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="glass-card p-6 md:p-8">
            <p className="text-xs font-medium tracking-wide text-white/45">[ OUR COMPANY ]</p>
            <h2
              id="about-company-heading"
              className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl"
            >
              Outvblue Technology Inc.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">
              <strong className="font-semibold text-white">Outvblue Technology Inc.</strong> is an
              Ontario-based technology company founded and run entirely by parents. Grounded in our
              core philosophy—<em className="text-white/80">Made by parents, for parents</em>—we
              harness innovative tech to help families thrive, beautifully balancing life at home
              and out in the world.
            </p>
          </article>

          <article className="glass-card p-6 md:p-8">
            <p className="text-xs font-medium tracking-wide text-white/45">[ OUR PRODUCT ]</p>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
              Occudule
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">
              Our flagship product, <strong className="font-semibold text-white">Occudule</strong>,
              was born from a desire to clear the digital clutter of modern parenting. It helps busy
              parents effortlessly stay on top of school and extracurricular logistics by automating
              the entire workflow.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
              Occudule seamlessly handles email processing, extracts key details, generates to-do
              lists, manages intelligent auto-replies, detects scheduling conflicts, and coordinates
              task assignments between family members.
            </p>
          </article>
        </div>

        <p className="text-gradient mx-auto mt-14 max-w-2xl text-center text-xl font-semibold tracking-tight md:text-2xl">
          We take care of the mental load, so you can focus on what matters most.
        </p>
      </div>
    </section>
  );
}
