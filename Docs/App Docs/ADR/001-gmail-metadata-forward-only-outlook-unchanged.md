# ADR 001: Gmail metadata + forward-only body; Outlook unchanged

**Status:** Superseded for **passive Gmail detection** by [ADR 002](002-inbound-forward-postmark.md) (2026-04-10). The **forward-only** processing principle remains; **metadata + Pub/Sub** is not pursued.

**Date:** 2026-04-09  
**Context:** Occudule email integrations (Google Gmail, Microsoft Outlook)

---

## Context

Parents connect school-related email to Occudule. Full mailbox reading for Gmail raises privacy and trust concerns. The product needs **timely awareness** of possibly relevant mail while keeping a clear story: **Gmail message bodies are not ingested via the Gmail API** for extraction; **explicit forward** uses the existing inbound pipeline.

Microsoft Outlook integration is already built and trusted for a different permission model; changing it in lockstep is unnecessary risk.

---

## Decision

1. **Gmail**
   - Use **Gmail API** access limited to **metadata** (and infrastructure required for **`users.watch`** + **Pub/Sub**) to detect candidate messages against **child-profile domains and allowlists** (with **subdomain** matching per product rules).
   - Send **one** push + in-app notification per qualifying message; **Ignore** dismisses once; **Open** targets **Gmail web** with documented fallback.
   - **Do not** use the Gmail API to read **message bodies** for school detection or AI extraction.
   - **Body content** enters Occudule only via **user-forwarded** mail through the **existing** inbound email processing pipeline.

2. **Outlook**
   - **No behavioral change** required for this initiative; existing Graph-based mail sync and processing remain as implemented.

---

## Consequences

### Positive

- Clear privacy narrative for Gmail (metadata vs body).
- Reuses proven **inbound + filtering + AI** pipeline for actual content.
- Avoids destabilizing Outlook users.

### Negative / trade-offs

- Users must **forward** mail for full automated processing from Gmail path (extra step).
- **Near-instant** Gmail detection depends on operating **Pub/Sub** + **watch** renewal reliably.
- **Open in Gmail (web)** may not always land on a single message; fallback UX is required.

### Follow-up

- Implementation details: [Gmail metadata feature spec](../Gmail_Metadata_Notifications.md), [Gmail Pub/Sub & watch](../Gmail_PubSub_Watch.md), [Inbound email runbook](../Inbound_Email_Runbook.md).
