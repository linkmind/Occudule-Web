"use client";

import Script from "next/script";

declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready: ((callback?: () => void) => void) | (() => void);
        floatwindow?: {
          visible: (action: "show" | "hide" | string) => void;
        };
        floatbutton?: {
          visible: (action: "show" | "hide" | string) => void;
        };
        chatwindow?: {
          visible: (action: "show" | "hide" | string) => void;
        };
      };
    };
  }
}

/**
 * Zoho SalesIQ embed `widgetcode` from Settings → Brands → Installation → Website.
 * Copy the value from the `widgetcode:"..."` line in the embed snippet (not the old `wc=` query param).
 */
export const zohoSalesIQWidgetCode =
  process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE?.trim() || "";

/** Zoho widget host for your data center, e.g. salesiq.zoho.com or salesiq.zoho.eu */
export const zohoSalesIQHost =
  process.env.NEXT_PUBLIC_ZOHO_SALESIQ_HOST?.trim() || "salesiq.zoho.com";

export type ZohoLoadState = "idle" | "loading" | "ready" | "error";

let loadState: ZohoLoadState = zohoSalesIQWidgetCode ? "loading" : "idle";
const readyListeners = new Set<() => void>();
const stateListeners = new Set<(state: ZohoLoadState) => void>();

function setLoadState(next: ZohoLoadState) {
  loadState = next;
  stateListeners.forEach((fn) => fn(next));
  if (next === "ready") {
    readyListeners.forEach((fn) => fn());
    readyListeners.clear();
  }
}

export function getZohoLoadState(): ZohoLoadState {
  return loadState;
}

export function subscribeZohoLoadState(listener: (state: ZohoLoadState) => void) {
  listener(loadState);
  stateListeners.add(listener);
  return () => {
    stateListeners.delete(listener);
  };
}

export function whenZohoReady(listener: () => void) {
  if (loadState === "ready") {
    listener();
    return () => {};
  }
  readyListeners.add(listener);
  return () => {
    readyListeners.delete(listener);
  };
}

function hasZohoOpenApis(): boolean {
  const salesiq = window.$zoho?.salesiq;
  return (
    typeof salesiq?.floatwindow?.visible === "function" ||
    typeof salesiq?.floatbutton?.visible === "function" ||
    typeof salesiq?.chatwindow?.visible === "function"
  );
}

/** True when SalesIQ APIs are available (not just our init stub). */
export function isZohoWidgetReady(): boolean {
  return hasZohoOpenApis();
}

function clickZohoFloatButton(): boolean {
  const selectors = ["#zsiqbtn", "#zsiq_float [role='button']", "#zsiq_float"];
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      el.click();
      return true;
    }
  }
  return false;
}

function showChatWidget(): boolean {
  const salesiq = window.$zoho?.salesiq;
  if (!salesiq) return false;

  const open = () => {
    salesiq.floatbutton?.visible?.("show");
    salesiq.floatwindow?.visible?.("show");
    salesiq.chatwindow?.visible?.("show");
    clickZohoFloatButton();
  };

  if (hasZohoOpenApis()) {
    open();
    return true;
  }

  const priorReady = salesiq.ready;
  salesiq.ready = function (...args: unknown[]) {
    if (typeof priorReady === "function" && priorReady !== salesiq.ready) {
      (priorReady as (...inner: unknown[]) => void).apply(salesiq, args);
    }
    open();
  };

  return clickZohoFloatButton();
}

function pollUntilReady(maxMs = 20000) {
  const started = Date.now();
  const tick = () => {
    if (isZohoWidgetReady()) {
      setLoadState("ready");
      return;
    }
    if (Date.now() - started >= maxMs) {
      setLoadState("error");
      return;
    }
    window.setTimeout(tick, 300);
  };
  tick();
}

/** Opens SalesIQ chat. Returns false if widget code is missing. */
export function openZohoLiveChat(): boolean {
  if (!zohoSalesIQWidgetCode) return false;

  if (loadState === "ready" || isZohoWidgetReady()) {
    setLoadState("ready");
    showChatWidget();
    return true;
  }

  if (loadState === "error") {
    return false;
  }

  whenZohoReady(() => showChatWidget());
  pollUntilReady();
  return true;
}

export function isZohoLiveChatConfigured(): boolean {
  return Boolean(zohoSalesIQWidgetCode);
}

export function ZohoSalesIQ() {
  if (!zohoSalesIQWidgetCode) return null;

  const widgetUrl = `https://${zohoSalesIQHost}/widget`;
  const initScript = `window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{mode:"async",widgetcode:${JSON.stringify(zohoSalesIQWidgetCode)},values:{},ready:function(){}};`;

  return (
    <>
      <div id="zsiqwidget" className="hidden" aria-hidden />
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {initScript}
      </Script>
      <Script
        id="zsiqscript"
        src={widgetUrl}
        strategy="afterInteractive"
        onLoad={() => pollUntilReady()}
        onError={() => setLoadState("error")}
      />
    </>
  );
}
