# System Architecture — Occudule

---

## 1. High-Level Overview

The system follows a **5-layer architecture**:

```
Mobile App (React Native + Expo)
  → API Layer (Node.js / NestJS)
    → Backend Services
      → AI Pipeline (OpenAI GPT models)
        → Database (PostgreSQL) + External Integrations
```

---

## 2. Mobile App Layer (Frontend)

| Property | Detail |
|---|---|
| Framework | React Native + Expo |
| Platform | iOS and Android |
| Responsibilities | Display processed email data, manage child profiles, review AI results, in-app calendar, checklist UI, settings |

---

## 3. Backend API Layer

| Property | Detail |
|---|---|
| Framework | Node.js or NestJS |
| Responsibilities | User accounts, subscription management, triggering AI processing jobs, webhook handling |

---

## 4. Email & Calendar Integration

Connected accounts may use provider APIs for sync and calendar features per OAuth. **Mail submitted by users via forward** uses a separate path: **SMTP → Postmark Inbound → Occudule webhook** (not provider-specific). See **[Inbound Forward Email Spec](Inbound_Forward_Email_Spec.md)** and **[Inbound Email Runbook](Inbound_Email_Runbook.md)**.

**Password reset** uses **Postmark Transactional** (outbound API) with a link to **`GET /reset-password`** on the API host (same origin as **`PASSWORD_RESET_WEB_BASE_URL`** / **`BACKEND_BASE_URL`**); the page submits to **`POST /auth/reset-password`**. Configure **`POSTMARK_SERVER_TOKEN`** and a verified **`POSTMARK_FROM_EMAIL`** in `backend/.env`.

### 4.1 Email monitoring & ingestion

| Path | Method |
|---|---|
| **Outlook (connected account)** | Microsoft Graph API, including **change notifications** where configured — see [Microsoft Outlook Implementation Checklist](Microsoft_Outlook_Implementation_Checklist.md). |
| **Gmail (connected account)** | Gmail API usage per app features and granted scopes (see [OAuth and scopes matrix](OAuth_And_Scopes_Matrix.md)). |
| **Forwarded mail (any user)** | User forwards to **`{prefix}.{random}@inbound.occudule.com`** → **Postmark** posts to **`/webhooks/inbound/{secret}/postmark`**; `email_logs` rows use **`provider=POSTMARK`**, **`ingestion_source=INBOUND`**, **grey score (same as `USER_SHARE`)** → preview extraction → **Event Confirmation**. Same path for mail forwarded from **Gmail or Outlook** apps. |

### 4.2 Calendar Sync (Bi-directional)

| Direction | Action |
|---|---|
| **Write** | Syncs detected school events → parent's Google / Outlook calendar |
| **Read** | Fetches the parent's **primary/default** calendar busy/events for **time conflict detection** (Outlook via Microsoft Graph, Google via Calendar API when enabled). Reads are **scoped** by the user's **Event conflict check range** (Settings; default 30 days, max 60). Prefer **batched** queries per user/time window rather than per-event calls; see **[Product Spec §14](Product_Spec.md#14-time-conflict-detection)** for UI (two-line model), failure handling, and rate-limit behavior. Webhooks may supplement mail sync but are not assumed for all calendar read paths. |

### 4.3 Microsoft (Outlook) OAuth — redirect URIs

Microsoft Entra redirect URIs (web callback for the API, plus optional native MSAL URIs for iOS/Android) are documented in **`Docs/Microsoft_OAuth_Setup.md`**. The backend exchanges the auth code at `{BACKEND_BASE_URL}/oauth/microsoft/callback` (see `backend/.env.example`).

---

## 5. AI Processing Pipeline

### 5.1 Model Selection

| Model | Use Case |
|---|---|
| `gpt-4o-mini` | Basic extraction and email classification |
| `gpt-4o` | Advanced analysis and attachment processing |
| `gpt-4.1` (or latest `o1` / `4o`) | Drafting email replies (Diamond plan) |

### 5.2 Processing Workflow

```
Incoming Email
  → Rule Filter (sender domain / known addresses)
  → Keyword Filter
  → AI Classifier (only if needed)
  → Text Extraction (email body)
  → Attachment Extraction (if applicable)
  → Structured Data Output → Database
```

### 5.3 Structured Data Output Schema

```json
{
  "child_name": "string",
  "institution_name": "string",
  "event_name": "string",
  "date_time": "ISO 8601 string",
  "location": "string",
  "summary": "string",
  "todos": ["string"],
  "deadline": "ISO 8601 string | null",
  "reply_required": "boolean",
  "action_required": "boolean",
  "action_url": "string | null",
  "source": "email | attachment",
  "others": "string | null"
}
```

---

## 6. Attachment & OCR Processing

| Property | Detail |
|---|---|
| Supported file types | PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), images (JPG, PNG, scanned flyers) |
| OCR tools | Tesseract OCR or Google Vision API |
| Output | Extracted text converted to plain string, merged with main email summary |
| Merge strategy | Attachment-derived fields are tagged with `"source": "attachment"` and merged into the unified structured output |

---

## 7. Database & Infrastructure

### 7.1 Database: PostgreSQL

| Concern | Implementation |
|---|---|
| Relational Integrity | Foreign key constraints + cascading deletes — all Events, To-Dos, and Notifications are tied to a specific `child_id` and `parent_id` |
| Data Security | Row-Level Security (RLS) at the DB level — API can only query rows where `authenticated_user_id` matches |
| Data Consistency | ACID transactions during AI processing — if extraction fails, no partial or ghost records are saved |

### 7.2 Queue System: Redis + BullMQ

| Concern | Implementation |
|---|---|
| Purpose | Background processing of heavy AI and OCR jobs — prevents blocking the main API thread |
| Reliability | At-least-once delivery guarantee — no school email is missed during high-traffic periods |

### 7.3 Push Notifications: Firebase Cloud Messaging (FCM)

- Real-time encrypted push alerts
- Triggers: new events, upcoming deadlines, time conflicts, required actions (e.g., form links)

---

## 8. Payment Gateway

| Property | Detail |
|---|---|
| Provider | Apple App Store + Google Play (IAP), unified via RevenueCat |
| Mobile SDK | RevenueCat SDK + native store purchase flows |
| Backend | NestJS / Node.js webhook listener (RevenueCat events) |
| Webhook events to handle | entitlement activation, renewal, billing issue/grace, cancellation, expiration |
| Behavior | User access is granted or revoked in near real-time based on entitlement status (`active` / `grace` / `expired`) — processed asynchronously, does not block the main API thread |
| Grace period | Handle failed payments with a grace period before downgrading the user's plan |

---

## 9. Full Stack Summary

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native + Expo (iOS & Android) |
| Backend API | Node.js or NestJS |
| AI Models | OpenAI GPT-4o mini, GPT-4o, GPT-4.1 |
| Email Integration | Gmail API, Microsoft Graph API, Postmark Inbound (forward path) |
| Calendar Integration | Google Calendar API, Microsoft Graph API |
| Attachment / OCR | Tesseract OCR or Google Vision API |
| Database | PostgreSQL (with RLS + FK constraints) |
| Queue / Background Jobs | Redis + BullMQ |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Payments | IAP (Apple/Google) + RevenueCat (SDK + Webhook Listener) |
| Localization | i18next (React Native) |
