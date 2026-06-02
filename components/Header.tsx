"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CtaButton } from "@/components/CtaButton";
import { Logo } from "@/components/Logo";

const navLinksAfterPrimary = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

const HERO_SECTION_ID = "top";

export function Header() {
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(pathname === "/");
  const [showEarlyAccess, setShowEarlyAccess] = useState(pathname !== "/");

  useEffect(() => {
    const hero = document.getElementById(HERO_SECTION_ID);
    if (!hero) {
      setHeroInView(false);
      setShowEarlyAccess(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
        setShowEarlyAccess(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-1px 0px 0px 0px",
      },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  const primaryNavLink = heroInView
    ? { href: "/#why-occudule", label: "Why Occudule" }
    : { href: "/#top", label: "Home" };

  const navLinks = [primaryNavLink, ...navLinksAfterPrimary];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-gutter py-4">
        <Logo wordmarkClassName="text-white" />
        <nav
          className="order-last flex w-full basis-full items-center justify-center gap-6 text-sm font-medium text-white/70 sm:order-none sm:w-auto sm:basis-auto sm:justify-end md:flex-1 lg:justify-center"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <div
            className={`overflow-hidden transition-[max-width,opacity] duration-300 ease-out ${
              showEarlyAccess
                ? "max-w-[14rem] opacity-100"
                : "pointer-events-none max-w-0 opacity-0"
            }`}
            aria-hidden={!showEarlyAccess}
          >
            <CtaButton href="/waitlist" size="sm" className="whitespace-nowrap">
              Join the Waitlist
            </CtaButton>
          </div>
        </div>
      </div>
    </header>
  );
}
