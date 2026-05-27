# Inbound Email — Internal Runbook (Postmark → Occudule API)

Operators and engineers: this runbook covers **forwarded** mail hitting **Postmark Inbound** and the **Occudule webhook**. It pairs with **[Inbound Forward Email Spec](Inbound_Forward_Email_Spec.md)**.

**Canonical product spec:** [Inbound_Forward_Email_Spec.md](Inbound_Forward_Email_Spec.md)

---

## 1. Components

| Component | Role |
|-----------|------|
| **Postmark** | One **Inbound** domain per environment (e.g. `inbound.occudule.com`, `inbound-staging.occudule.com`, `inbound-dev.occudule.com`) — each has its own Postmark **Server / Stream**, receives SMTP and **POSTs JSON** to our webhook. |
| **Occudule API** | `POST /webhooks/inbound/{secret}/postmark` — validates **secret**, maps **recipient** → user, validates **sender vs sync_email**, idempotent insert, **`USER_SHARE`-equivalent grey score** → **extraction preview** → Event Confirmation. |
| **Pipeline** | Same as **`USER_SHARE`**: not the full filter cron first; forced grey score → `email-extraction` queue. |

---

## 2. Environments

| Env | `POSTMARK_INBOUND_DOMAIN` (backend `.env` or API host vars) | Postmark webhook URL |
|-----|----------------|-------------|
| **Prod** | `inbound.occudule.com` (default if unset) | `https://<prod-api-host>/webhooks/inbound/<POSTMARK_INBOUND_WEBHOOK_SECRET>/postmark` |
| **Staging** | e.g. `inbound-staging.occudule.com` | `https://<staging-api-host>/webhooks/inbound/<secret>/postmark` — use **staging API** env vars (Railway etc.), not Expo |
| **Local dev** | e.g. `inbound-dev.occudule.com` | HTTPS tunnel to your laptop, e.g. `https://<ngrok>/webhooks/inbound/<secret>/postmark`; same secret as `backend/.env` |

`POSTMARK_INBOUND_WEBHOOK_SECRET` must match the `{secret}` segment in the URL Postmark calls. Each environment should use a **different** Postmark inbound server/stream and **different** secret unless you temporarily point one stream at a tunnel for debugging.

**Where to set:** `POSTMARK_INBOUND_DOMAIN` and `POSTMARK_INBOUND_WEBHOOK_SECRET` are read only by the **Nest backend** (`UsersService`, `PostmarkInboundService`). Set them in **`backend/.env`** (local) or **deployment variables for the API** (staging/production). **Do not** rely on Expo / EAS environment variables for these — those apply to the mobile app (`EXPO_PUBLIC_*`), not the server.

See `backend/.env.example`.

---

## 3. DNS & Postmark setup (order)

1. Add **inbound domain(s)** in Postmark (`inbound.occudule.com` for prod; optional `inbound-staging.occudule.com`, `inbound-dev.occudule.com` for other streams) per Postmark Inbound instructions (DNS / verification).
2. Create/configure **Inbound Stream** for each environment on the matching Postmark **Server**.
3. Set **Webhook URL** on that stream to the full HTTPS URL including **path secret** (staging/prod API host, or ngrok for local).
4. Set **`POSTMARK_INBOUND_DOMAIN`** on the corresponding API deployment to the same hostname (no `https://`).
5. Apply DB migrations **`034_users_inbound_local_part.sql`** and **`035_email_logs_provider_postmark.sql`**.

---

## 4. Address format (reminder)

`{prefix}.{random}@<POSTMARK_INBOUND_DOMAIN>` — e.g. prod: `@inbound.occudule.com`; staging: `@inbound-staging.occudule.com`. Stored as `users.inbound_local_part`; assigned when **`sync_email`** is set (see `UsersService.ensureInboundForwardAddress`).

---

## 5. Webhook handler behavior (checklist)

1. **Authenticate** path `secret` === `POSTMARK_INBOUND_WEBHOOK_SECRET`.
2. **Parse** JSON body; require **`MessageID`**.
3. **Resolve recipient** local part (must match `POSTMARK_INBOUND_DOMAIN`).
4. **Load user** by `inbound_local_part`; require **`sync_email`**.
5. **Validate** sender headers vs **`sync_email`**; if no match → **200** + skip (log `sender_mismatch`).
6. **Idempotency:** skip if `(user_id, MessageID)` already exists.
7. **Insert** `email_logs`: `provider=POSTMARK`, `ingestion_source=INBOUND`, `confidence_score=45`, `body_plain` from Text/HTML.
8. **Enqueue** `email-extraction` job (same as `USER_SHARE`).

---

## 6. Troubleshooting

| Symptom | Check |
|---------|--------|
| **sender_mismatch** logs | Forwarded mail often lists the **school** in `From`; Occudule matches **`sync_email`** against `From`, `Sender`, `Reply-To`, `Resent-From`, `Return-Path`. Some clients may need a different forward method until headers align. |
| **413** on webhook | Body size: API uses **15mb** JSON limit in `main.ts`. |
| **401** on webhook | Wrong path secret or missing `POSTMARK_INBOUND_WEBHOOK_SECRET`. |

---

## 7. Observability

### 7.1 Application logs (Postmark inbound)

Each webhook request produces **one structured JSON line** (Nest `Logger`, searchable by `postmark_inbound`) with **metadata only**:

| Field (typical) | Meaning |
|-----------------|--------|
| `type` | Always `postmark_inbound`. |
| `outcome` | `processed` \| `duplicate` \| `skipped` \| `auth_failed` \| `error`. |
| `reason` | When skipped: `missing_message_id`, `no_recipient`, `unknown_recipient`, `no_sync_email`, `sender_mismatch`, `bad_request`. |
| `postmark_message_id` | Postmark `MessageID` when present. |
| `user_id` | Occudule user when resolved. |
| `recipient_local` | Inbound local part (before `@`) when relevant — **not** the full forward address domain secret. |
| `email_log_id` | Created or existing row when `outcome` is `processed` or `duplicate`. |
| `duplicate` | `true` when idempotent replay. |
| `candidate_email_count` | For `sender_mismatch`, number of candidate addresses checked (not the addresses themselves). |
| `duration_ms` | Handler time after auth succeeds. |
| `error` / `error_message` | Truncated message on failure or validation skip (no stack dumps in the JSON line). |

**Never logged in these lines:** full Postmark JSON, email **subject** text, **TextBody** / **HtmlBody**, webhook **secret**, or raw candidate email strings.

Optional **`POSTMARK_INBOUND_LOG_DEBUG=true`**: adds a `debug` object with **lengths only** (`subject_len`, `text_body_len`, `html_body_len`, `has_message_id`). Default `false` in production.

**HTTP status** for delivery (200 vs 4xx/5xx) is shown in the **Postmark** inbound activity / webhook logs, not duplicated in application logs for every field.

### 7.2 Alerts

- Alert on webhook **5xx** and extraction queue failures.

---

## 8. Revision history

| Date | Change |
|------|--------|
| 2026-04-09 | Initial runbook |
| 2026-04-10 | Aligned with Postmark, prefix+random, sync-email validation, secret URL, idempotency |
| 2026-04-11 | USER_SHARE-equivalent grey path; implementation reference; troubleshooting |
| 2026-04-12 | Structured `postmark_inbound` JSON logging policy; optional `POSTMARK_INBOUND_LOG_DEBUG` |
| 2026-05-11 | Per-environment `POSTMARK_INBOUND_DOMAIN`; backend-only env (not Expo); multi-domain Postmark setup |

