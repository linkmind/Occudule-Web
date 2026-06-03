"use client";

import Link from "next/link";
import { LiveChatEntry } from "@/components/LiveChatEntry";
import { isZohoLiveChatConfigured } from "@/components/ZohoSalesIQ";

export function ContactLiveChat() {
  const configured = isZohoLiveChatConfigured();

  return (
    <div className="glass-card p-6 md:p-8">
      <p className="text-xs font-medium tracking-wide text-white/45">[ LIVE CHAT ]</p>
      <h2 className="mt-3 text-lg font-semibold tracking-tight text-white">
        {configured ? "Chat with our team" : "Real-time support"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        {configured
          ? "Same Zoho SalesIQ support as in the Occudule app—get answers in real time during business hours."
          : "Live chat is also available in the Occudule app. On the web, use the contact form or email support@occudule.com."}
      </p>

      <LiveChatEntry />

      {!configured ? (
        <p className="mt-4 text-sm text-white/55">
          Or email{" "}
          <a
            href="mailto:support@occudule.com"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white"
          >
            support@occudule.com
          </a>
        </p>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-white/40">
        Chat is powered by{" "}
        <a
          href="https://www.zoho.com/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/55 underline underline-offset-2 transition hover:text-accent"
        >
          Zoho SalesIQ
        </a>
        . Please avoid sharing passwords or payment card numbers in chat. See our{" "}
        <Link
          href="/privacy"
          className="text-white/55 underline underline-offset-2 transition hover:text-accent"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
