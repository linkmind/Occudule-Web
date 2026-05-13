import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "Occudule — AI email productivity for busy parents",
    description:
      "Spend less time in your inbox and more time with your family. AI-powered email for modern parents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
