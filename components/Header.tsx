"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { CtaButton } from "@/components/CtaButton";
import { Logo } from "@/components/Logo";

const navLinksAfterPrimary = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

const HERO_SECTION_ID = "top";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-6 w-6"
      aria-hidden
    >
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path strokeLinecap="round" d="M4 7h16" />
          <path strokeLinecap="round" d="M4 12h16" />
          <path strokeLinecap="round" d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const menuId = useId();
  const [heroInView, setHeroInView] = useState(pathname === "/");
  const [showEarlyAccess, setShowEarlyAccess] = useState(pathname !== "/");
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const primaryNavLink = heroInView
    ? { href: "/#why-occudule", label: "Why Occudule" }
    : { href: "/#top", label: "Home" };

  const navLinks = [primaryNavLink, ...navLinksAfterPrimary];

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-gutter py-4">
        <Logo wordmarkClassName="text-white" />

        <nav
          className="hidden items-center justify-center gap-6 text-sm font-medium text-white/70 lg:flex lg:flex-1"
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white transition hover:border-white/30 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-[65px] z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id={menuId}
        className={`absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-background/95 backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out lg:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-label="Mobile primary"
        aria-hidden={!menuOpen}
      >
        <ul className="mx-auto flex max-w-content flex-col gap-1 px-gutter py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg px-3 py-3 text-base font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-white/10 pt-4">
            <CtaButton
              href="/waitlist"
              size="md"
              className="w-full justify-center"
              onClick={closeMenu}
            >
              Join the Waitlist
            </CtaButton>
          </li>
        </ul>
      </nav>
    </header>
  );
}
