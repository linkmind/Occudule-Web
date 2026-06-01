import Link from "next/link";
import { Logo } from "@/components/Logo";

const footerColumns = [
  {
    title: "Quick links",
    links: [
      { href: "/", label: "Home" },
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Corporate",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/news", label: "News" },
      { href: "/articles", label: "Articles" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-primary py-16 text-surface">
      <div className="mx-auto max-w-content px-gutter">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Logo wordmarkClassName="text-surface" />
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/50">
              Occudule is a trademark of Outvblue Technology Inc.
            </p>
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
          <p>Made by parents for parents</p>
        </div>
      </div>
    </footer>
  );
}
