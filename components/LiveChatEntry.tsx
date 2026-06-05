"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getZohoLoadState,
  isZohoLiveChatConfigured,
  openZohoLiveChat,
  subscribeZohoLoadState,
  type ZohoLoadState,
} from "@/components/ZohoSalesIQ";

function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6 text-accent"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function statusMessage(state: ZohoLoadState): string | null {
  if (state === "loading") {
    return "Loading chat widget…";
  }
  if (state === "error") {
    return "Chat could not load. In Zoho: Settings → Brands → Installation → Website, copy the widgetcode value from the embed snippet (not the full script). Add your site domain under allowed domains, set NEXT_PUBLIC_ZOHO_SALESIQ_HOST if you use EU/IN/AU (e.g. salesiq.zoho.eu), disable ad blockers, then restart the dev server.";
  }
  return null;
}

export function LiveChatEntry() {
  const configured = isZohoLiveChatConfigured();
  const [loadState, setLoadState] = useState<ZohoLoadState>(
    configured ? getZohoLoadState() : "idle",
  );
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!configured) return;
    return subscribeZohoLoadState(setLoadState);
  }, [configured]);

  const handleOpenChat = useCallback(() => {
    if (!configured || loadState === "error") return;

    setIsOpening(true);
    openZohoLiveChat();

    window.setTimeout(() => setIsOpening(false), 1500);
  }, [configured, loadState]);

  if (!configured) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-5">
        <p className="text-sm font-medium text-white/70">Live chat entry (setup required)</p>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Add your Zoho SalesIQ widget code to{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-accent">
            .env.local
          </code>
          :
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/70">
          {`NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE=your_widgetcode_value
# Optional if not on US data center:
# NEXT_PUBLIC_ZOHO_SALESIQ_HOST=salesiq.zoho.eu`}
        </pre>
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          In Zoho: Settings → Brands → Installation → Website. Copy the{" "}
          <strong className="text-white/55">widgetcode</strong> string from the embed snippet.
          Restart <code className="text-white/50">npm run dev</code> after saving.
        </p>
      </div>
    );
  }

  const hint = statusMessage(loadState);
  const label = isOpening
    ? "Opening live chat…"
    : loadState === "ready"
      ? "Start live chat now"
      : loadState === "error"
        ? "Live chat unavailable"
        : "Start live chat";

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleOpenChat}
        disabled={loadState === "error"}
        className="group flex w-full items-center gap-4 rounded-xl border border-white/15 bg-white/[0.06] p-4 text-left transition hover:border-accent/40 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Open live chat with Occudule support"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-primary/80">
          <ChatIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-white group-hover:text-accent">{label}</span>
            <span
              className={`inline-flex h-2 w-2 shrink-0 rounded-full ${
                loadState === "ready"
                  ? "bg-success"
                  : loadState === "error"
                    ? "bg-cta"
                    : "animate-pulse bg-accent/80"
              }`}
              aria-hidden
            />
          </span>
          <span className="mt-1 block text-sm text-white/55">
            Connect with our team in real time via Zoho SalesIQ
          </span>
        </span>
        <span
          className="shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        >
          →
        </span>
      </button>

      {hint ? (
        <p
          className={`mt-3 text-xs leading-relaxed ${loadState === "error" ? "text-cta/90" : "text-white/50"}`}
          role="status"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
