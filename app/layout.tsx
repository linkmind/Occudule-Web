import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { ZohoSalesIQ } from "@/components/ZohoSalesIQ";
import { APP_STORE_ID, BRAND_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Occudule — AI email productivity for busy parents",
  authors: [{ name: "Outvblue Technology Inc." }],
  description:
    "Occudule helps parents triage, draft, and stay on top of email with AI—so school threads, work, and family logistics take less mental load.",
  keywords: [
    "Occudule",
    "email productivity",
    "AI email",
    "parents",
    "busy parents",
    "inbox zero",
  ],
  applicationName: BRAND_NAME,
  itunes: {
    appId: APP_STORE_ID,
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "192x192" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: BRAND_NAME,
    title: "Occudule — AI email productivity for busy parents",
    description:
      "Spend less time in your inbox and more time with your family. AI-powered email for modern parents.",
    type: "website",
    url: SITE_URL,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen">
        <SiteJsonLd />
        <ZohoSalesIQ />
        {children}
      </body>
    </html>
  );
}
