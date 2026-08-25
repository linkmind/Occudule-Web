import Link from "next/link";
import { Logo } from "@/components/Logo";

type FooterLink = {
  href: string;
  label: string;
  hidden?: boolean;
};

const footerColumns: { label: string; links: FooterLink[] }[] = [
  {
    label: "NAVIGATION",
    links: [
      { href: "/", label: "Home" },
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    label: "CORPORATE",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/news", label: "News", hidden: true },
      { href: "/articles", label: "Articles" },
      { href: "/documentation", label: "Documentation" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "LEGAL",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t border-white/10 bg-background py-16">
      <div className="mx-auto max-w-content px-gutter">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Logo wordmarkClassName="text-white" />
            <p className="mt-3 text-xs font-medium tracking-wide text-white/40">
              Occudule is a trademark of Outvblue Technology Inc.
            </p>
            <p className="mt-4">
              <a
                href="mailto:support@occudule.com"
                className="text-sm text-white/60 transition hover:text-accent"
              >
                support@occudule.com
              </a>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {footerColumns.map((col) => (
              <div key={col.label}>
                <p className="text-xs font-medium tracking-wide text-white/40">
                  [ {col.label} ]
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links
                    .filter((link) => !link.hidden)
                    .map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-white"
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
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Outvblue Technology Inc. All rights reserved.</p>
          <p>Made by parents for parents</p>
        </div>
      </div>
    </footer>
  );
}
