# OAuth and API Scopes — Matrix (Occudule)

This matrix records **which Google and Microsoft permissions** apply to which features, so engineering, support, and compliance stay aligned. It is a **living document** — update it whenever scopes or features change.

**Related:** [Inbound Forward Email Spec](Inbound_Forward_Email_Spec.md) (active forward path) · [Microsoft OAuth setup](Microsoft_OAuth_Setup.md) · [Gmail metadata doc](Gmail_Metadata_Notifications.md) (deprecated)

---

## 1. Google (Gmail & related)

| Surface | Purpose | Scopes / APIs (intended) | Notes |
|---------|---------|---------------------------|--------|
| **Sign-in with Google** (mobile PKCE) | Authenticate the user to Occudule | OpenID Connect scopes: `openid`, `email`, `profile` (via Google OAuth; not Gmail content) | Uses **Android** (or platform-appropriate) OAuth client; see mobile env docs. |
| **Gmail — mail ingestion via forward** | User **forwards** mail to `{prefix}.{random}@inbound.occudule.com`; Postmark webhook → Occudule | **No additional Gmail scope** required *for inbound processing* beyond whatever the app already uses for Gmail **account connection / sync** (if any). Inbound path does **not** use Gmail API to read the forwarded body — body arrives via **SMTP → Postmark**. | Active model: [Inbound Forward Email Spec](Inbound_Forward_Email_Spec.md). |
| **Google Contacts — Occudule forward shortcut** | Optional: add the user’s forward address to **Google Contacts** (same Google account as sync) via People API | `https://www.googleapis.com/auth/contacts` (requested with Gmail connect / reconnect) | Requires **People API enabled** in the GCP project for `GOOGLE_CLIENT_ID` — see [Google OAuth setup](Google_OAuth_Setup.md). Users must **reconnect** Google if they connected before this scope existed. |
| **Gmail — metadata + Pub/Sub (deprecated)** | *(Not pursued)* | Would have used `gmail.metadata` + Pub/Sub — see archived [Gmail metadata doc](Gmail_Metadata_Notifications.md) | **Superseded** by forward + Postmark per [ADR 002](ADR/002-inbound-forward-postmark.md). |
| **Google Calendar** (if enabled for conflict / sync) | Read/write calendar per existing product | Calendar API scopes as already configured | Unchanged by Gmail metadata track; keep separate from Gmail body promise. |

### 1.1 Gmail body content

| Path | Body access? |
|------|----------------|
| **Gmail API** (sync / other features) | Per whatever scopes the user granted for **connected account** features (see app + consent screen). |
| **User forwards email to Occudule** | **Yes** — body arrives via **Postmark Inbound** webhook and flows through the **existing** email pipeline; **`source=inbound`** requires **Event Confirmation** before events. |

---

## 2. Microsoft (Outlook / Graph) — unchanged

| Surface | Purpose | Scopes / APIs | Notes |
|---------|---------|----------------|-------|
| **Outlook connection** | Mail sync, extraction, webhooks | Delegated permissions as in **[Microsoft OAuth Setup](Microsoft_OAuth_Setup.md)** and **[Microsoft Outlook Implementation Checklist](Microsoft_Outlook_Implementation_Checklist.md)** | **Unchanged** by Postmark inbound; users may also **forward** mail from Outlook — same inbound pipeline as Gmail forwards. |
| **Outlook contacts — Occudule forward shortcut** | Optional: add forward address to **Outlook contacts** via Graph | `Contacts.ReadWrite` (requested with Microsoft connect / reconnect) | Same reconnect note as Google if users connected before this scope. |

---

## 3. OAuth consent & verification

- **Google Cloud:** OAuth consent screen and any **verification** requirements depend on scopes and app type; coordinate with compliance before adding sensitive scopes.
- **Incremental auth:** Request **Gmail / Google** scopes only when needed for features that use the Gmail API (e.g. sync); **forward-to-inbound** does not require extra Gmail API scopes for body ingestion.

---

## 4. Revision history

| Date | Change |
|------|--------|
| 2026-04-09 | Initial matrix for Gmail metadata + Pub/Sub; Outlook marked unchanged |
| 2026-04-10 | Active path: Postmark inbound forward; deprecated metadata row; ADR 002 |
| 2026-04-12 | Google `contacts` + Microsoft `Contacts.ReadWrite` for cloud “Add to Contacts” (Occudule forward). |
