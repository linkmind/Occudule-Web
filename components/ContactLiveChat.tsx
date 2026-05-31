"use client";

import Link from "next/link";
import { useState } from "react";
import { isZohoLiveChatConfigured, openZohoLiveChat } from "@/components/ZohoSalesIQ";

export function ContactLiveChat() {
  const [chatUnavailable, setChatUnavailable] = useState(false);
  const configured = isZohoLiveChatConfigured();

  function handleOpenChat() {
    const opened = openZohoLiveChat();
    if (!opened) {
      setChatUnavailable(true);
    }
  }

  if (!configured) {
    return (
      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Live chat</p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-primary">
          Real-time support
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-primary/70">
          Live chat is also available in the Occudule app. On the web, use the contact form or email{" "}
          <a
            href="mailto:support@occudule.com"
            className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
          >
            support@occudule.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">Live chat</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-primary">
        Chat with our team
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-primary/70">
        Same Zoho SalesIQ support as in the Occudule app—get answers in real time during business
        hours.
      </p>
      <button
        type="button"
        onClick={handleOpenChat}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border-2 border-primary/15 bg-surface px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
      >
        Start live chat
      </button>
      {chatUnavailable ? (
        <p className="mt-3 text-xs text-primary/55" role="status">
          Chat is still loading—try again in a moment, or use the form below.
        </p>
      ) : null}
      <p className="mt-4 text-xs leading-relaxed text-primary/50">
        Chat is powered by{" "}
        <a
          href="https://www.zoho.com/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary"
        >
          Zoho SalesIQ
        </a>
        . Please avoid sharing passwords or payment card numbers in chat. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
