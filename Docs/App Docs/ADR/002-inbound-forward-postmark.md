# ADR 002: Inbound forward via Postmark (supersedes Gmail metadata detection for “mail in”)

**Status:** Accepted  
**Date:** 2026-04-10  
**Supersedes:** [ADR 001](001-gmail-metadata-forward-only-outlook-unchanged.md) for **how** users bring mail into Occudule when **forwarding** (ADR 001’s forward half remains conceptually valid; **metadata + Pub/Sub** detection is **not** pursued).

---

## Context

Occudule needs a reliable way for **Gmail and Outlook users** to submit email for processing **without** depending on share-sheet payloads or Gmail API metadata watches. **SMTP inbound** to a provider (Postmark) with a **webhook** is provider-agnostic and preserves full message content.

---

## Decision

1. Use **Postmark Inbound** on **`inbound.occudule.com`** with **environment-specific** streams (staging vs production).
2. **One inbound address per user:** `{sync_email_prefix}.{random_segment}@inbound.occudule.com` (see [Inbound Forward Email Spec](../Inbound_Forward_Email_Spec.md)).
3. **Validate** that forwarded mail appears to come from the user’s **sync email**; reject or quarantine otherwise.
4. **Webhook security:** **HTTPS** + **secret segment in the URL path** (no secret in client apps).
5. **Idempotency** using Postmark’s **MessageID** (or equivalent) to avoid duplicate processing on retries.
6. **Processing:** tag **`source=inbound`**; **always** require **Event Confirmation** before creating events (grey-area path).
7. **Microsoft Graph** mail sync for Outlook users remains a **separate**, existing path — unchanged by this ADR.

---

## Consequences

### Positive

- Single inbound pipeline for **all** forwarders (Gmail or Outlook app).
- Full message body available for the existing extraction pipeline.
- Clear security story (token in address + sync-email validation).

### Trade-offs

- Users must **forward** (or share is supplementary elsewhere); no passive “we saw your inbox” for this path.
- Operational ownership of Postmark streams, DNS, and webhook secrets per environment.

---

## References

- [Inbound Forward Email Spec](../Inbound_Forward_Email_Spec.md)  
- [Inbound Email Runbook](../Inbound_Email_Runbook.md)
