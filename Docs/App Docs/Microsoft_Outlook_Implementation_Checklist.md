# Microsoft / Outlook — Implementation Checklist

Companion to **`Microsoft_OAuth_Setup.md`**. Tracks what is implemented vs optional follow-ups. Last reviewed: 2026-03-27.

---

## Completed (feature-level)

| Item | Notes |
|------|--------|
| **Connect Microsoft / Outlook** | OAuth authorize + callback; `user_email_connections` (`provider: microsoft`); refresh via `ensureValidMicrosoftAccessToken` (`EmailSyncService`). Mobile: `getMicrosoftAuthorizeUrl`, in-app browser, deep links (`user-profile.tsx`). |
| **Sync & ingest mail** | Outlook: Graph **delta** + **push** (Inbox `created`). `syncOutlookForUser` runs delta; daily delta cron; `GET /email-sync/mail` runs Gmail poll + Outlook delta then filter pipeline. |
| **Rule-based filtering** | `runFilterForEmailLog` is provider-agnostic; loads full body via `getOutlookMessageBody` when `body_plain` is empty for `OUTLOOK`. |
| **Grey-area / AI extraction** | Same pipeline for all logs; Outlook attachments fetched in `EmailExtractionRunnerService` when `provider === 'OUTLOOK'`. |
| **User Profile connection status** | `outlook_connected`, connection status copy, OAuth link, “Sync mail now,” Outlook-specific warnings on token/list failures (`email-sync.controller.ts`). |

---

## Product / domain scope (current app behavior)

- Registration and sync-email validation allow **consumer** Microsoft domains (e.g. `outlook.com`, `hotmail.com`, …) per `mobile/lib/authValidation.ts`.
- **Org / Microsoft 365 custom domains** are not treated as supported Microsoft accounts in that flow unless you extend domain lists and provider detection.

---

## Premium / Diamond & quotas

| Behavior | Status |
|----------|--------|
| Extraction / conflict overlap logic using `plan_name` | Applies to mail from **either** Gmail or Outlook (not provider-specific). |
| **USER_SHARE** import quota (`importSharedGmailMessage`) | **Gmail only** today; no Outlook share-import endpoint. |
| `max_emails_per_month` on subscription catalog | Field exists on `subscriptions`; **not** referenced in email-filter/sync paths in code—confirm product intent if you need a hard monthly cap on normal sync. |

---

## Outlook mail delivery (implemented)

| Mechanism | Behavior |
|-----------|----------|
| **Graph subscription** | Inbox-only, `changeType: created`. `POST/GET /webhooks/microsoft-graph` (no JWT). `BACKEND_BASE_URL` must be **HTTPS** (e.g. paid ngrok). Set `MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE` in `backend/.env`. Subscription created after Microsoft OAuth and renewed twice daily if missing/near expiry. |
| **Delta reconcile** | Stored `ms_graph_delta_link` on `user_email_connections`. Daily cron + manual **Sync mail** (`syncOutlookForUser` → delta). |
| **Polling** | The previous 10-minute Outlook list cron is **removed**; rely on push + delta. |

Run migration `025_microsoft_graph_subscription_delta.sql` on your database.

## Optional follow-ups

- [ ] **Share-to-app** for Outlook (parity with `POST /email-sync/import-shared-gmail`).
- [ ] **Enforce** `max_emails_per_month` (or remove from schema/docs if unused).
- [ ] **Production** Entra redirect URI + `BACKEND_BASE_URL` — see `Microsoft_OAuth_Setup.md` §1 and §6.
- [ ] **Outlook calendar read for time conflict (Premium+):** Extend Entra **API permissions** and OAuth **scopes** beyond `Mail.Read` (e.g. calendar read / free-busy as chosen). Implement batched Graph calls for the user’s **primary** calendar only, scoped by **Event conflict check range** (`Docs/Screens/settings_screen_spec.md` §2.2). Product/UI: **Product Spec §14**, `email_confirmation_flow_spec.md`, and screen specs (`home_screen_spec`, `calendar_screen_spec`, `todos_screen_spec`, `addnewevent_screen_spec`).

---

## Related docs

- `Docs/Microsoft_OAuth_Setup.md` — redirect URIs, env vars, API permissions.
- `Docs/System_Architecture.md` §4 — email/calendar integration (architecture; not all items are implemented yet).
- `Docs/Product_Spec.md` §14 — time conflict detection (two-line UI, Outlook URL behavior, batching, failures).