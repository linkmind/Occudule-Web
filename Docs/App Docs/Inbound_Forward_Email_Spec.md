# Inbound forward email (Postmark) — Product & technical spec

**Status:** Active (replaces the Gmail metadata + Pub/Sub detection approach for bringing mail into Occudule via forward.)

**Related:** [Inbound Email Runbook](Inbound_Email_Runbook.md) · [Email Filtering Feature Spec](App%20Features/Email_Filtering_Feature_Spec.md) · [ADR 002](ADR/002-inbound-forward-postmark.md)

---

## 1. Purpose

Allow **both Gmail-connected and Outlook-connected users** to **forward** school-related email into Occudule. Inbound mail is received via **Postmark Inbound** (webhook to Occudule API), then processed through the **same grey-area path as `USER_SHARE`**: forced score in the grey band → **preview extraction** → **Event Confirmation** (`AWAITING_CONFIRMATION`) — **not** the high-confidence auto-extraction path.

**Important:** The **mail client** used to forward (Gmail app, Outlook app, web, etc.) does **not** change the Postmark integration — **per environment**, one inbound domain + webhook contract (`POSTMARK_INBOUND_DOMAIN`).

**We do not** run the full multi-step domain/keyword/AI **filter** on inbound rows first; ingestion is intentionally aligned with share-import (see §7).

---

## 2. Inbound domain and environments

| Environment | Postmark | Inbound domain (`POSTMARK_INBOUND_DOMAIN`) |
|-------------|----------|----------------|
| **Production** | Dedicated **Server / Stream** (e.g. Occudule prod) | `inbound.occudule.com` — DNS + Postmark verification |
| **Staging** | **Separate** Server / Stream from prod | e.g. `inbound-staging.occudule.com` |
| **Local / tunnel** | Optional dedicated stream (e.g. Occudule Dev) | e.g. `inbound-dev.occudule.com`; webhook URL points at **HTTPS tunnel** to developer’s Nest (ngrok) |

Set `POSTMARK_INBOUND_DOMAIN` in the **Nest API** environment (`backend/.env` locally; Railway/hosting vars for staging/prod). Default when unset: `inbound.occudule.com`. The mobile app receives the full forward address via **`inbound_forward_address`** from the API — no Expo env var.

Streams are **environment-specific** so webhooks, secrets, and traffic stay isolated.

---

## 3. Per-user address format (one address per user)

**Format:** **`{prefix}.{random}@<domain>`** where `<domain>` is **`POSTMARK_INBOUND_DOMAIN`** (e.g. production: `inbound.occudule.com`).

| Part | Rule |
|------|------|
| **`prefix`** | Derived from the user’s **sync email** local part (the part before `@`), normalized (e.g. lowercase, safe characters only). |
| **`random`** | Fixed-length **unguessable** segment (16 hex chars) to avoid collisions and guessing. **Required** — addresses must not be only the prefix. |
| **Storage** | `users.inbound_local_part` stores the **full local part** (`prefix.randomhex`); domain comes from env `POSTMARK_INBOUND_DOMAIN` (default `inbound.occudule.com`). |

**Regeneration** of the address is **out of scope** until explicitly specified.

**API:** `GET /users/me` includes **`inbound_forward_address`** (full address) when `sync_email` is set and the local part has been allocated.

---

## 4. Sender validation (sync email)

Occudule **only accepts** inbound mail when at least one **candidate sender** from the Postmark payload matches the user’s **`sync_email`** (case-insensitive). Candidates include `From` / `FromFull`, and common headers such as **Sender**, **Reply-To**, **Resent-From**, **Return-Path** (see implementation).

**Note:** Some clients forward mail in a way where the parent’s address appears only in certain headers; if **no** candidate matches, the webhook **acknowledges** the request but **does not** create an `email_log` (logged as `sender_mismatch`).

---

## 5. Webhook security

- **HTTPS only** for non-local deployments.
- **Secret embedded in the webhook URL path**, e.g. `POST /webhooks/inbound/{POSTMARK_INBOUND_WEBHOOK_SECRET}/postmark` — reject requests that do not match `POSTMARK_INBOUND_WEBHOOK_SECRET`.
- Store the secret in **server environment** — **never** in the mobile app.

Postmark configuration: set the **Inbound webhook URL** in the Stream settings to the full HTTPS URL including the secret segment.

---

## 6. Idempotency

Postmark (or the network) may **deliver the same inbound message more than once** (retries).

- Use Postmark’s **`MessageID`** as `email_logs.message_id` (with **`provider = POSTMARK`**) and rely on the unique index **`(user_id, message_id)`**.

---

## 7. Processing pipeline & Event Confirmation (grey area — same as `USER_SHARE`)

| Step | Behavior |
|------|----------|
| Tag | `ingestion_source = INBOUND`, `provider = POSTMARK` |
| Score | **`confidence_score`** set to the **same grey score** as **`USER_SHARE`** (45) — **not** the multi-step filter |
| Queue | **Enqueue extraction** (preview JSON) → user confirms on **Event Confirmation** / `AWAITING_CONFIRMATION` — **not** auto-create calendar events without confirmation |

This matches **`USER_SHARE`** (share sheet import): forced grey band → preview extraction → confirmation. It **does not** run `runFilterForEmailLog` first.

---

## 8. Outlook vs Gmail

| Aspect | Note |
|--------|------|
| **Postmark webhook** | Single implementation; provider-agnostic. |
| **Microsoft Graph sync** | Unchanged for users who connect Outlook — separate from forward path. |
| **Gmail** | Users may forward from Gmail app; validation uses headers vs **`sync_email`**. |

---

## 9. Observability (application logs)

The API emits **one structured log line per inbound webhook** (`type: postmark_inbound`) with outcomes, ids, skip reasons, and timing — **not** full payloads, bodies, or subjects. Operators should use **Postmark’s dashboard** for per-delivery HTTP status and retries. Details: [Inbound Email Runbook — §7.1](Inbound_Email_Runbook.md#71-application-logs-postmark-inbound).

---

## 10. Revision history

| Date | Change |
|------|--------|
| 2026-04-10 | Active spec: Postmark, `inbound.occudule.com`, prefix+random address, sync-email validation, secret URL, idempotency, `source=inbound` → always Event Confirmation. |
| 2026-04-11 | Clarified: inbound uses **USER_SHARE-equivalent grey score + extraction**, not the full filter pipeline first. Implementation: `POSTMARK` provider, `INBOUND` ingestion_source, webhook route live. |
| 2026-04-12 | Documented structured inbound logging policy; pointer to runbook. |
| 2026-05-11 | Per-environment inbound domains (`POSTMARK_INBOUND_DOMAIN`); staging/dev examples |

