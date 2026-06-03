import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ContactLiveChat } from "@/components/ContactLiveChat";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
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
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-background">
          <div className="mesh-overlay" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-hero-glow bg-cover bg-top bg-no-repeat"
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-gutter pb-12 pt-8 md:pb-16">
            <Link
              href="/"
              className="text-sm font-medium text-white/50 transition hover:text-white"
            >
              ← Back to home
            </Link>
            <div className="mx-auto mt-10 max-w-2xl text-center">
              <SectionHeader
                label="CONTACT US"
                title="We're here to help"
                description="Questions about Occudule, early access, or your account? Send a message, email us, or start a live chat."
                titleId="contact-heading"
              />
            </div>
          </div>
        </section>

        <section className="section-dark py-section" aria-label="Contact options">
          <div className="mesh-overlay opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-2xl px-gutter">
            <div className="flex flex-col gap-6">
              <ContactForm />

              <div className="glass-card p-6 md:p-8">
                <p className="text-xs font-medium tracking-wide text-white/45">[ EMAIL ]</p>
                <h2 className="mt-3 text-lg font-semibold text-white">Write to us directly</h2>
                <a
                  href="mailto:support@occudule.com"
                  className="mt-3 block text-lg font-semibold text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
                >
                  support@occudule.com
                </a>
              </div>

              <ContactLiveChat />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
