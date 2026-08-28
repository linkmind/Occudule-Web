import Link from "next/link";
import type { DocSectionSlug } from "@/lib/documentation";

type DocumentationSectionProps = {
  section: DocSectionSlug;
  label: string;
  docs: { slug: string; title: string; description?: string }[];
};

export function DocumentationSection({ section, label, docs }: DocumentationSectionProps) {
  const headingId = `${section}-heading`;

  return (
    <section className="glass-card" aria-labelledby={headingId}>
      <div className="border-b border-white/10 px-6 py-5 md:px-10 md:py-6">
        <h2 id={headingId} className="text-xl font-semibold tracking-tight text-white md:text-2xl">
          {label}
        </h2>
      </div>

      {docs.length === 0 ? (
        <p className="px-6 py-6 text-base leading-relaxed text-white/55 md:px-10">
          Documents coming soon.
        </p>
      ) : (
        <ul className="divide-y divide-white/10">
          {docs.map((doc, index) => (
            <li key={doc.slug}>
              <Link
                href={`/documentation/${section}/${doc.slug}`}
                className="group flex items-start justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.04] md:px-10"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 inline-block shrink-0 self-start whitespace-nowrap leading-none text-xs font-medium tabular-nums text-white/40">
                    {`[${String(index + 1).padStart(2, "0")}]`}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-white transition group-hover:text-accent">
                      {doc.title}
                    </span>
                    {doc.description ? (
                      <span className="mt-1 block text-sm leading-relaxed text-white/55">
                        {doc.description}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="mt-0.5 shrink-0 text-white/35 transition group-hover:text-accent" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
