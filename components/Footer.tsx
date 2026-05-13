import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "#how-it-works", label: "How it works" },
      { href: "#proof", label: "Results" },
      { href: "#waitlist", label: "Waitlist" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#footer", label: "About" },
      { href: "mailto:support@occudule.com", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#footer", label: "Privacy" },
      { href: "#footer", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-primary py-16 text-surface">
      <div className="mx-auto max-w-content px-gutter">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight">Occudule</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/50">
              Outvblue Technology Inc.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              AI email productivity built for parents who need fewer tabs, fewer “sorry for the
              delay” messages, and more presence with their kids.
            </p>
            <address className="mt-5 text-sm not-italic leading-relaxed text-white/65">
              Suite 500, 7030 Woodbine Avenue
              <br />
              Markham, Ontario L3R 6G2
              <br />
              <a
                href="mailto:support@occudule.com"
                className="mt-2 inline-block text-accent transition hover:text-accent/90"
              >
                support@occudule.com
              </a>
            </address>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent/90">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/75 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Outvblue Technology Inc. All rights reserved.</p>
          <p>Occudule — made for busy parents everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
