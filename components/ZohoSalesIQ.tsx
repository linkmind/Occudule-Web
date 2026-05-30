"use client";

import Script from "next/script";

declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready: (callback: () => void) => void;
        floatwindow?: {
          visible: (action: "show" | "hide") => void;
        };
      };
    };
  }
}

const widgetCode = process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE;

export function ZohoSalesIQ() {
  if (!widgetCode) return null;

  return (
    <>
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};`}
      </Script>
      <Script
        id="zsiqscript"
        src={`https://salesiq.zohopublic.com/widget?wc=${widgetCode}`}
        strategy="afterInteractive"
      />
    </>
  );
}

export function openZohoLiveChat() {
  if (!widgetCode) return false;

  const salesiq = window.$zoho?.salesiq;
  if (!salesiq) return false;

  salesiq.ready(() => {
    salesiq.floatwindow?.visible("show");
  });

  return true;
}

export function isZohoLiveChatConfigured(): boolean {
  return Boolean(widgetCode);
}
