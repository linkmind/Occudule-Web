import type { Metadata } from "next";
import Link from "next/link";
import { AppPreviewVideo } from "@/components/AppPreviewVideo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { StoreBadges } from "@/components/StoreBadges";
import { APP_STORE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download Occudule — AI email for busy parents",
  description:
    "Download Occudule on the App Store. Turn school threads, drafts, and deadlines into organized action—without living in your inbox. Google Play coming soon.",
  openGraph: {
    title: "Download Occudule",
    description:
      "Get Occudule on iPhone. School email, family schedules, and to-dos in one app.",
    type: "website",
    url: "/download",
  },
};

const highlights = [
  "Turn school and activity emails into events, to-dos, and reminders",
  "Keep the whole household aligned in one family hub",
  "Free to start — upgrade only when you need more",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Occudule",
  operatingSystem: "iOS",
  applicationCategory: "LifestyleApplication",
  description:
    "AI email productivity for busy parents. Occudule turns school threads into events, to-dos, and a shared family hub.",
  downloadUrl: APP_STORE_URL,
  installUrl: APP_STORE_URL,
  image: absoluteUrl("/occudule-logo.png"),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function DownloadPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
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
                label="DOWNLOAD THE APP"
                title="Get Occudule on your phone"
                description="Occudule is on the App Store now for iPhone. Google Play is coming soon."
                titleId="download-heading"
              />
            </div>
          </div>
        </section>

        <section className="section-dark py-section" aria-labelledby="download-heading">
          <div className="mesh-overlay opacity-40" aria-hidden />
          <div className="relative mx-auto grid max-w-content items-center gap-12 px-gutter lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div>
              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/80 md:text-base">
                    <span className="mt-0.5 font-bold text-success" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <p className="text-xs font-medium tracking-wide text-white/45">
                  [ AVAILABLE NOW ]
                </p>
                <StoreBadges className="mt-4" />
              </div>

              <div className="mt-8 hidden items-start gap-4 sm:flex">
                <div className="shrink-0 rounded-xl bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/badges/app-store-qr.svg"
                    alt="QR code to download Occudule on the App Store"
                    width={112}
                    height={112}
                    className="h-28 w-28"
                  />
                </div>
                <p className="max-w-xs pt-1 text-sm leading-relaxed text-white/55">
                  On a computer? Scan with your iPhone camera to open Occudule in the App
                  Store.
                </p>
              </div>

              <p className="mt-8 text-sm text-white/50">
                Need help after install? See{" "}
                <Link
                  href="/documentation/how-tos/how-to-set-up-your-free-occudule-account"
                  className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
                >
                  how to set up your free account
                </Link>
                , or email{" "}
                <a
                  href="mailto:support@occudule.com?subject=Occudule%20download"
                  className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
                >
                  support@occudule.com
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col items-center">
              <p className="mb-4 text-xs font-medium tracking-wide text-white/45 lg:hidden">
                [ APP PREVIEW ]
              </p>
              <AppPreviewVideo />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
