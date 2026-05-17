import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#proof", label: "Results" },
  { href: "#pricing", label: "Pricing" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-gutter py-4">
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
          className="order-last flex w-full basis-full items-center justify-center gap-6 text-sm font-medium text-primary/80 sm:order-none sm:w-auto sm:basis-auto sm:justify-end md:flex-1 lg:justify-center"
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
            href="#footer"
            className="hidden text-sm font-medium text-primary/70 hover:text-primary sm:inline"
          >
            Sign in
          </Link>
          <CtaButton href="#waitlist" size="sm">
            Get early access
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
