"use client";

import Script from "next/script";

declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready: (callback: () => void) => void;
        floatwindow?: {
          visible: (action: "show" | "hide" | string) => void;
        };
        chatwindow?: {
          visible: (action: "show" | "hide" | string) => void;
        };
      };
    };
  }
}

/** Public widget code from Zoho SalesIQ → Settings → Embed (the `wc=` value only). */
export const zohoSalesIQWidgetCode =
  process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE?.trim() || "";

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
  return () => stateListeners.delete(listener);
}

export function whenZohoReady(listener: () => void) {
  if (loadState === "ready") {
    listener();
    return () => undefined;
  }
  readyListeners.add(listener);
  return () => readyListeners.delete(listener);
}

/** True when the real SalesIQ widget APIs or UI are present (not just our init stub). */
export function isZohoWidgetReady(): boolean {
  const salesiq = window.$zoho?.salesiq;
  if (!salesiq) return false;

  const hasApis =
    typeof salesiq.floatwindow?.visible === "function" ||
    typeof salesiq.chatwindow?.visible === "function";

  const hasDom =
    document.getElementById("zsiq_float") !== null ||
    document.getElementById("zsiqbtn") !== null ||
    document.querySelector("[id^='zsiq']") !== null;

  return hasApis || hasDom;
}

function clickZohoFloatButton(): boolean {
  const selectors = ["#zsiqbtn", "#zsiq_float", "[id^='zsiq']"];
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      el.click();
      return true;
    }
  }
  return false;
}

function showChatWidget() {
  const salesiq = window.$zoho?.salesiq;
  if (!salesiq) return false;

  salesiq.ready(() => {
    salesiq.floatwindow?.visible("show");
    salesiq.chatwindow?.visible("show");
    clickZohoFloatButton();
  });

  return clickZohoFloatButton();
}

function pollUntilReady(maxMs = 15000) {
  const started = Date.now();
  const tick = () => {
    if (isZohoWidgetReady()) {
      setLoadState("ready");
      showChatWidget();
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

  const widgetUrl = `https://salesiq.zohopublic.com/widget?wc=${encodeURIComponent(zohoSalesIQWidgetCode)}`;

  return (
    <>
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};`}
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
