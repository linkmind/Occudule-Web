# Privacy & Consent — Copy Checklist (forward path + connected accounts)

Use this checklist when you ship or change **Postmark inbound**, **assigned forward addresses**, **sync-email validation**, or **Outlook / Gmail connected** features. Legal should review final strings.

**Canonical policy:** `../assests/legal/privacy_policy_screen.md`  
**Feature spec:** [Inbound Forward Email Spec](Inbound_Forward_Email_Spec.md)

---

## 1. Must stay true in all surfaces

| Statement | Applies to |
|-----------|------------|
| Users receive a **unique** Occudule inbound address; they **forward** mail to it when they want Occudule to process content. | In-app, help, support |
| Processing of **forwarded** content uses the **existing** pipeline; **new events** from **`source=inbound`** require **user confirmation** (Event Confirmation) before being added to the calendar. | Same |
| Occudule **validates** that forwarded mail appears to come from the user’s **sync email** (or policy you disclose); other senders may be rejected. | Same |
| **Outlook:** Microsoft Graph **sync** behavior for connected accounts remains as today unless product changes. | Same |
| **Gmail:** Connected-account features use only the **Google permissions** the user granted; **inbound body** for forwarded mail arrives via **SMTP/inbound provider**, not by “reading Gmail” for that forward. | Same |

---

## 2. In-app surfaces to review

| Surface | Notes |
|---------|--------|
| **Contact Us — Live chat (Zoho SalesIQ)** | Disclose Zoho as processor; link to Zoho privacy; advise against passwords/cards in chat. Canonical copy: `../assests/legal/privacy_policy_screen.md` (in-app live chat section). |
| **Profile / Settings — “Your Occudule address”** | Show full address; **Copy**; explain forward-only; sync-email must match. |
| **Connect Gmail / Outlook** | Distinguish **sync** permissions vs **forward** instructions (users can forward from either client). |
| **Event Confirmation** | Inbound-sourced items always land here before events — copy should not promise auto-add without confirmation. |
| **Errors — validation failed** | Plain language: “We only accept forwards from the email you use with Occudule” (if that’s the rule). |

---

## 3. Words to use carefully

| Term | Guidance |
|------|----------|
| **“We read your Gmail”** | Avoid; prefer **“forward to your Occudule address”** and **“we process what you send us.”** |
| **Vendor names (Postmark)** | User-facing: **“our inbound mail service”** unless legal approves naming. |

---

## 4. Revision history

| Date | Change |
|------|--------|
| 2026-04-09 | Initial checklist (metadata + forward) |
| 2026-04-10 | Rewritten for Postmark inbound, sync-email validation, Event Confirmation; metadata path deprecated |
| 2026-04-26 | Zoho SalesIQ (Mobilisten) live chat: Privacy Policy + Terms + in-app screens updated; vendor named in data sharing. |
