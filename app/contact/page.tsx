import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ContactLiveChat } from "@/components/ContactLiveChat";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ZohoSalesIQ } from "@/components/ZohoSalesIQ";

export const metadata: Metadata = {
  title: "Contact — Occudule",
  description:
    "Contact Outvblue Technology Inc. for Occudule support, partnerships, or general questions.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ZohoSalesIQ />
      <main className="relative overflow-hidden border-b border-border bg-surface-muted bg-mesh">
        <div
          className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80"
          aria-hidden
        />
        <div className="relative mx-auto max-w-content px-gutter py-section">
          <Link
            href="/"
            className="text-sm font-medium text-primary/60 transition hover:text-primary"
          >
            ← Back to home
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary/55">
            Contact us
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-primary md:text-4xl">
            We&apos;re here to help
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary/75">
            Questions about Occudule, early access, or your account? Send a message, email us, or
            start a live chat.
          </p>

          <div className="mt-12 mx-auto flex max-w-2xl flex-col gap-8">
            <ContactForm />

            <div className="rounded-card border border-border bg-surface p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Email</p>
              <a
                href="mailto:support@occudule.com"
                className="mt-2 block text-lg font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
              >
                support@occudule.com
              </a>
            </div>

            <ContactLiveChat />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
