import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";

const navLinks = [
  { href: "#top", label: "Home" },
  { href: "#why-occudule", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#articles", label: "Articles" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-gutter py-3.5 md:py-4">
        <Link href="#top" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-accent"
            aria-hidden
          >
            O
          </span>
          <span className="text-lg font-semibold tracking-tight text-primary">Occudule</span>
        </Link>
        <nav
          className="order-last flex w-full basis-full items-center justify-center gap-4 text-sm font-medium text-primary/75 sm:order-none sm:w-auto sm:basis-auto sm:gap-5 md:flex-1 lg:justify-center lg:gap-8"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="mailto:support@occudule.com"
            className="hidden text-sm font-medium text-primary/70 hover:text-primary md:inline"
          >
            Contact
          </Link>
          <CtaButton href="#waitlist" size="sm">
            Get started
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
