"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        mode?: string;
        widgetcode?: string;
        values?: Record<string, unknown>;
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

type EmbedStyle = "wc" | "widgetcode";

type ZohoEmbedConfig = {
  code: string;
  host: string;
  style: EmbedStyle;
};

function normalizeWidgetCode(raw: string): string {
  const trimmed = raw.trim();
  const fromSnippet = trimmed.match(/widgetcode\s*:\s*["']([^"']+)["']/i);
  if (fromSnippet) return fromSnippet[1];

  const fromUrl = trimmed.match(/[?&](?:widgetcode|wc)=([^&"'\s]+)/i);
  if (fromUrl) return fromUrl[1];

  return trimmed.replace(/^["']|["']$/g, "");
}

function resolveEmbedConfig(): ZohoEmbedConfig | null {
  const rawCode = process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE?.trim() || "";
  if (!rawCode) return null;

  const rawHost =
    process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_HOST?.trim() ||
    process.env.NEXT_PUBLIC_ZOHO_SALESIQ_HOST?.trim() ||
    "";

  const explicitStyle = process.env.NEXT_PUBLIC_ZOHO_SALESIQ_EMBED_STYLE?.trim() as
    | EmbedStyle
    | undefined;

  const srcMatch = rawCode.match(/src=["'](https:\/\/[^"']+\/widget\?[^"']+)["']/i);
  if (srcMatch) {
    const url = new URL(srcMatch[1]);
    const code =
      url.searchParams.get("wc") ||
      url.searchParams.get("widgetcode") ||
      normalizeWidgetCode(rawCode);
    const style: EmbedStyle =
      explicitStyle ||
      (url.searchParams.has("wc") ? "wc" : "widgetcode");

    return {
      code,
      host: url.host,
      style,
    };
  }

  const code = normalizeWidgetCode(rawCode);
  const style: EmbedStyle =
    explicitStyle || (rawHost.includes("zohopublic") ? "wc" : "widgetcode");
  const host =
    rawHost || (style === "wc" ? "salesiq.zohopublic.com" : "salesiq.zoho.com");

  return { code, host, style };
}

const embedConfig = resolveEmbedConfig();

/** Public widget id: the `wc=` or `widgetcode` value from Zoho embed. */
export const zohoSalesIQWidgetCode = embedConfig?.code || "";

/** Zoho widget script host, e.g. salesiq.zohopublic.ca */
export const zohoSalesIQHost = embedConfig?.host || "";

export type ZohoLoadState = "idle" | "loading" | "ready" | "error";

let loadState: ZohoLoadState = zohoSalesIQWidgetCode ? "loading" : "idle";
let embedStarted = false;
const readyListeners = new Set<() => void>();
const stateListeners = new Set<(state: ZohoLoadState) => void>();

function setLoadState(next: ZohoLoadState) {
  if (loadState === next) return;
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

function hasZohoWidgetDom(): boolean {
  return (
    document.getElementById("zsiq_float") !== null ||
    document.getElementById("zsiqbtn") !== null ||
    document.getElementById("zsiq_chat") !== null
  );
}

/** True when SalesIQ APIs or the float UI are present. */
export function isZohoWidgetReady(): boolean {
  return hasZohoOpenApis() || hasZohoWidgetDom();
}

function widgetScriptUrl(config: ZohoEmbedConfig): string {
  const param = config.style === "wc" ? "wc" : "widgetcode";
  return `https://${config.host}/widget?${param}=${encodeURIComponent(config.code)}`;
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
  if (!salesiq) return clickZohoFloatButton();

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

  if (hasZohoWidgetDom()) {
    return clickZohoFloatButton();
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

function pollUntilReady(maxMs = 30000) {
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

function installZohoEmbed() {
  if (!embedConfig) return;

  if (embedStarted) {
    pollUntilReady();
    return;
  }
  embedStarted = true;
  setLoadState("loading");

  window.$zoho = window.$zoho || {};

  if (embedConfig.style === "wc") {
    window.$zoho.salesiq = window.$zoho.salesiq || { ready: function () {} };
  } else {
    window.$zoho.salesiq = window.$zoho.salesiq || {
      values: {},
      ready: function () {},
    };
    window.$zoho.salesiq.mode = "async";
    window.$zoho.salesiq.widgetcode = embedConfig.code;
  }

  const priorReady = window.$zoho.salesiq.ready;
  window.$zoho.salesiq.ready = function (...args: unknown[]) {
    if (typeof priorReady === "function" && priorReady !== window.$zoho?.salesiq?.ready) {
      (priorReady as (...inner: unknown[]) => void).apply(window.$zoho?.salesiq, args);
    }
    window.setTimeout(() => {
      if (isZohoWidgetReady()) setLoadState("ready");
    }, 0);
  };

  if (document.getElementById("zsiqscript")) {
    pollUntilReady();
    return;
  }

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.id = "zsiqscript";
  script.defer = true;
  script.src = widgetScriptUrl(embedConfig);
  script.onload = () => pollUntilReady();
  script.onerror = () => setLoadState("error");

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

/** Opens SalesIQ chat. Returns false if widget code is missing. */
export function openZohoLiveChat(): boolean {
  if (!embedConfig) return false;

  installZohoEmbed();

  if (loadState === "error") {
    return false;
  }

  if (loadState === "ready" || isZohoWidgetReady()) {
    setLoadState("ready");
    showChatWidget();
    return true;
  }

  whenZohoReady(() => showChatWidget());
  pollUntilReady();
  return true;
}

export function isZohoLiveChatConfigured(): boolean {
  return Boolean(embedConfig);
}

export function ZohoSalesIQ() {
  useEffect(() => {
    installZohoEmbed();
  }, []);

  return null;
}
