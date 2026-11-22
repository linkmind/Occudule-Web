import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedbackClient } from "./feedback-client";

export const metadata: Metadata = {
  title: "Share feedback — Occudule",
  description: "Share a few traits that describe a child for their personal growth exercise.",
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-surface-muted px-4 py-8 text-primary">Loading the feedback form…</main>}>
      <FeedbackClient />
    </Suspense>
  );
}
