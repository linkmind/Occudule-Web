
# Occudule – Product Specification

## Product Overview
**Product Name:** Occudule  
**Tagline:** Email Productivity Tool for Busy Parents

Occudule helps parents automatically extract important information from school emails and turn them into actionable tasks, reminders, and calendar events.

---

# 1. Problem Statement

Parents receive many emails from schools and educational institutions containing:

- Events
- Deadlines
- Permission forms
- Items children must bring
- School uniform / PE attire requirements
- Birthday invitations from classmates

Important information is often buried inside long emails or attachments, causing parents to miss tasks, deadlines, or events.

---

# 2. Target Users

Primary users:

- Parents with children aged **4–13 years old**
- Families with **multiple children**
- Busy parents relying heavily on **school email communication**

---

# 3. Platforms

- Mobile App
  - iOS
  - Android

---

# 4. Monetization Model

Subscription-based pricing.

## Free Plan

Features:

- Email summary (subject + main body)
- Key information extraction:
  - Child name
  - School / Institution
  - Event
  - Date
  - Time
  - Location
  - To‑Do tasks
  - Whether reply is required
  - Link to original email
  - Actions required such permission form, sign up form etc.
- App notifications and reminders
- Action-required detection:
  - Permission forms
  - Sign‑up links
  - Feedback forms
  - Web submissions

Limits:

- 8 processed emails per month
- 1 school account for 1 child
- Sender email whitelist: can add up to 3 email addresses

---

## Premium Plan — $3.99/month (or $39.99/year)

Includes **all Free plan features**, plus:

- Unlimited email processing
- Event time conflict detection (see §14):
  - Between siblings (Occudule)
  - Between school events and parent **primary** external calendar (Outlook / Google), within Settings **Event conflict check range**
- Integration with:
  - Google Calendar
  - Outlook Calendar
- Up to:
  - **1 school + 3 institution accounts per child**
  - **2 children**
  - Sender email whitelist: can add up to 10 email addresses

---

## Diamond Plan — $5.99/month (or $59.99/year)

Includes **all Premium plan features**, plus:

- **1 school + 6 institution accounts per child**
- Up to **4 children**
- Unlimited Sender email whitelist
- AI-generated email auto reply


---

# 5. Payment System

Payment processing uses **in-app subscriptions (IAP)** via Apple App Store and Google Play, with **RevenueCat** used for cross-platform subscription state and webhook handling.

Requirements:

- Secure in-app checkout
- Automated monthly and yearly billing
- Grace period handling for failed payments
- In-app plan upgrade and downgrade
- Immediate feature unlocking after successful payment

---

# 6. Multilingual Support

The system must support multicultural families.

Supported processing languages may include:

- English
- French
- Mandarin
- Cantonese
- Spanish, etc.

Requirements:

- AI must analyze and summarize emails in multiple languages.
- Mobile app interface must support localization.
- Users can choose their preferred language for:
  - summaries
  - menus
  - notifications

Frontend framework: **React Native**

---

# 7. Core Features

## 7.1 Login and Registration

Supported login methods:

- Email + password (Gmail and Microsoft addresses only)
- Google account (Gmail allowlist)
- Microsoft account (Microsoft allowlist)
- Apple ID — **any email Apple returns** may create an Occudule account (including iCloud and Hide My Email). Sign in with Apple is identity only.

**Mail sync** still requires a Gmail or Microsoft mailbox on User Profile. If the Apple login email is Gmail or Microsoft, prefill the sync-email field; otherwise leave it blank and remind the user to type a supported address there. See [registration_login_screen_spec.md](Screens/registration_login_screen_spec.md) §2.3 and [profile_screen_spec.md](Screens/profile_screen_spec.md) §1.3.

---

## 7.2 Email Monitoring

**Inbound forward (all users):** Parents may **forward** school email to a per-user address on **`inbound.occudule.com`** (format: prefix from sync email + random segment). Mail is received via **Postmark Inbound** (`POST /webhooks/inbound/{secret}/postmark`) and follows the same **grey-area / preview extraction / Event Confirmation** path as **share-import** (`USER_SHARE`), not the automatic high-score extraction path. See **[Inbound Forward Email Spec](Inbound_Forward_Email_Spec.md)**.

The system connects to:

- Gmail
- Outlook
- Hotmail
- @live.com
- @msn.com


Incoming emails are analyzed and filtered.

Detection methods:

- Sender domain
- Known school email addresses
- Keyword detection
- Child name detection

### Multi‑Stage Filtering Pipeline

```
Incoming Email
      ↓
Rule Filter
      ↓
Keyword Filter
      ↓
AI Classifier (if needed)
```

This prevents:

- False positives (irrelevant emails)
- Missed school-related emails

---

# 8. AI Email Analysis

When a targeted email (its confidence score falls in or above the grey-area score) is detected, AI extracts:

- Child name
- School or institution name
- Event name
- Date and time
- Location
- Email summary
- To‑Do items
- Deadline (if applicable)
- Whether reply is required (included in all plans, but the App will draft the email reply for users who are on Diamond plan.)
- Whether action is required (included in all plans)


Examples of detected actions:

- Fill out permission form
- Sign up for event
- Submit feedback
- Provide parental consent


---

# 9. Attachment Processing

Supported attachments:

- PDF
- Images
- Word documents
- Excel files
- PowerPoint files

Processing steps:

1. Read attachment content
2. Generate attachment summary
3. Extract important information
4. Categorize information
5. Merge with email analysis results
6. Mark the information as **source: attachment**

---

# 10. Event and Checklist Creation

Detected information is converted into structured data.

-For grey-area, the App extracts the information first then asks the user to confirm if to add it as a new event.
- If the email's confidence score is above the grey-area score, the App extracts the information and then directly add it as a new event on the frontend.
Please refer to the email confirmation flow specification for details.

Stored in:

- Application database
- Linked to the original email

The original email **remains in the user's email provider**.

---

# 11. Push/In-App Notification System

The app pushes notifications, and in the meantime creates in-app notifications for:

- Event Confirmation Notification
- New Event Added Notification
- Upcoming Event Notification

---

# 12. AI Draft Reply (Diamond only)

When a reply is required:

1. User can click on the "Draft a reply for me" on the event details or event confirmation screen (only active for users are on diamond plan) to have the App draft the reply.
2. If AI needs user's input to complete the draft then the AI can ask user 1-3 questions before drafting the reply. If the Ai can draft directly, then AI directly generates the draft.
3. Draft appears inside the supported email account's reply window.
4. Parent reviews and edits.
5. Parent sends the email.
Note: Free/Premium users might still reply in the mail app themselves.

---

# 13. Multi‑Child Support

A single parent account can manage:

- Multiple children
- Multiple schools or institutions

Views can be filtered by:

- Child
- School/Institution

Events, tasks, and notifications are child-specific.

---

# 14. Time Conflict Detection

## 14.1 Scope

The system detects scheduling overlap between:

1. **Sibling / school events (Occudule)** — other stored events for the same parent account (different children, same calendar day, overlapping time).
2. **External parent calendar (Premium+)** — the signed-in parent’s **primary/default** calendar only (not shared calendars, not every mailbox-linked calendar).

**Plans:** Full conflict detection (sibling + external) and navigation to resolve conflicts are **Premium and Diamond**. Free users may see conflict state and link affordances per plan rules; following links to conflicting events or external calendar may require upgrade (see app gating).

## 14.2 Settings: check range

Conflict detection **does not** scan all time. It is limited by **Event conflict check range** in Settings (see [Settings — Event Conflict Check Range](Screens/settings_screen_spec.md)):

- **Default:** 30 days ahead from today  
- **Maximum:** 60 days (user-selectable)

Backend and external API calls must respect this window when loading events and when batching Microsoft Graph / Google Calendar requests.

## 14.3 UI: two independent lines

Present **two** separate rows (Event Confirmation and Event Details):

| Line | Question | If Yes | If No |
|------|-----------|--------|------|
| **A — Sibling / school (Occudule)** | Does this overlap another Occudule event? | Show link: e.g. **“Open the conflicting event”** (Premium+ navigates; Free may see upgrade). | **No** |
| **B — External calendar** | Does this overlap something on the parent’s external calendar? | Show link: e.g. **“View in external calendar”** (Premium+ opens URL; Free may see upgrade). | **No** |

Do **not** merge into a single vague “time conflict” line if both dimensions are product-relevant.

### External link behavior (no deep links)

- **Label:** Use neutral copy such as **“View in external calendar”** — do not imply a specific conflicting meeting title unless the product later surfaces a verified title from the provider.
- **URL (Outlook):** `https://outlook.office.com/calendar/` with optional **week/day query parameters** when the conflict window can be derived, to land the user in a useful view without event-specific deep links.
- **Deep links:** Not used for opening the native Outlook/Google apps from this flow.
- **Fallback:** If no reliable URL can be built, still show **Yes** for the external line and plain text such as *“Overlaps something on your Outlook calendar”* (or provider-specific wording for Google when implemented).

## 14.4 Batching, caching, and rate limits

- **Batch by user and time window:** Prefer **one** Graph (or Google) request per user per relevant `[start, end]` interval that returns all events or busy blocks in range, then compute overlaps in memory against Occudule events in that window — avoid one HTTP call per event.
- **Per-request caching:** For a single API response (e.g. week view load), cache external busy data **in memory for that request** (short TTL, seconds) if the same window is queried multiple times; avoid persisting unless there is a separate product reason.
- **Throttling:** On HTTP **429** or **503**, use exponential backoff; for that request, **degrade** external data (see §14.5) rather than blocking the whole screen indefinitely.

## 14.5 Failures and “not checked”

When a line **cannot** be evaluated (database error, token revoked, missing OAuth calendar scope, Graph/Google error after backoff, etc.), do **not** silently claim **No**.

- **Line A (Occudule):** Surface a clear manual-check message, e.g. *“School/sibling events couldn’t be checked. Please verify manually.”* (Adjust copy if marketing prefers “calendar” wording, but the failure is local data/enrichment, not the user’s Outlook/Google token.)
- **Line B (External):** Surface e.g. *“External calendar couldn’t be checked. Please verify manually.”*

Optional future enhancement: structured `check_status` per line (`ok` / `skipped` / `error`) for analytics and support.

## 14.6 Providers: Outlook first, Google parity

- **Outlook (Microsoft):** Ship first where the user base justifies it. Requires **calendar read** (or free/busy–equivalent) OAuth scopes in addition to existing **mail** scopes; users may need to **re-consent** after scope expansion.
- **Google Calendar:** Separate OAuth scope and implementation, **same internal contract** (overlap window, optional title, optional web URL) behind a single provider-agnostic “external busy” abstraction.
- **Gating:** Keep Google and Outlook external checks behind the **same Premium** rules and similar user-facing strings where appropriate (“Google calendar” vs “Outlook calendar”).

---


# 15. Application Workflow

1. Monitor supported email account's inbox.
2. Detect school-related emails.
3. Extract structured information.
4. Analyze attachments.
5. Store extracted data in database.
6. Check with users about if the event is relevant and accurate through event confirmation.
7. Generate events and to-dos.
8. Sync events with calendars.
8. Detect conflicts.
9. Push and create notifications.
10. Generate AI draft replies when required.

---

# 16. Calendar Integration

The application will:

- Sync events to the parent’s:
  - Google Calendar
  - Outlook Calendar
- Display an **in‑app calendar view**
- Detect conflicts between children’s / sibling (Occudule) events and the parent’s **primary** external calendar, within the **Event conflict check range**, as specified in **§14 Time Conflict Detection** (two-line UI, batching, failure messaging, Outlook vs Google rollout).

---

# 17. Family Groups (shared household)

Spouse or co-parents can share one Occudule household: the same children, events, to-dos, and notifications. Detailed engineering rules: [Family Group Invite — Implementation Plan](App%20Features/Family_Group_Invite_Implementation_Plan.md). QA checklist: [Family Group QA Checklist](App%20Features/Family_Group_QA_Checklist.md).

## 17.1 Roles

| Role | Description |
|------|-------------|
| **Owner** | Original account; one per family. Owns children data and **all email ingestion**. |
| **Member** | Invited adult who accepted; **0–3** members by plan (see below). |

## 17.2 Invitations

- **Who can invite:** Owner only.
- **Channel:** Transactional email (Postmark) → web join (`/family/join?token=`) or in-app accept (`/family-join`, `POST /family/join/accept-app`).
- **Invitee email:** Gmail or Microsoft domains only (same as registration).
- **Expiry:** 7 days (configurable).
- **Optional relationship label** (display only, e.g. Spouse).

### Member limits by plan

| Plan | Max active + pending members (excluding owner) |
|------|-----------------------------------------------|
| FREE | 0 (invite disabled) |
| PREMIUM | 1 |
| DIAMOND | 3 |

## 17.3 Capabilities

| Capability | Owner | Member |
|------------|:-----:|:------:|
| View/edit shared children, events, todos | ✅ | ✅ |
| Email sync, forward, inbound, sender whitelist setup | ✅ | ❌ |
| Calendar OAuth (conflicts, external writes) | ✅ | ✅ |
| Invite / revoke / resend | ✅ | ❌ |
| Change subscription (IAP) | ✅ | ❌ (read-only + prompt to ask owner) |
| Leave family | — | ✅ |

## 17.4 Subscription and billing

- **Single billable subscriber:** Owner’s RevenueCat `app_user_id` and `subscription_id`.
- **Members** see the owner’s effective plan on Subscription (read-only); upgrade/downgrade/restore blocked in app and API (`FAMILY_MEMBER_CANNOT_MANAGE_SUBSCRIPTION`).
- **Owner downgrade:** Applies to the whole family; downgrade is **blocked** in backend sync if active members exceed the new plan’s cap until the owner removes members.

## 17.5 Join and leave

- **New invitee:** Web password creation or existing password sign-in; OAuth users accept in the mobile app after sign-in.
- **Existing invitee with child profiles:** Two one-time paths (Phase 8 — see implementation plan §14):
  - **Join on the group owner’s plan** — delete all child profiles on their account, then join as member (current-style join).
  - **Bring child profiles into the family group** — merge selected (or all) profiles into the group owner’s family within **Child Seats**; delete any remaining profiles before join completes.
- **Inviting:** Group owner is **not** blocked or warned when invitee already has child profiles. Invitee **cannot accept** if already a member of another family.
- **On join (Options 1 & 2):** Member uses **group owner’s** subscription; email sync cleared; mail OAuth torn down; calendar may be reconnected on User Profile. Merged profiles keep institutions/sender lists; plan limits enforced like **downgrade grandfathering** on save.
- **Cannot switch** join path after accept.
- **Member leaves:** `POST /family/leave` — loses shared data access; personal account remains.
- **Owner deletes account:** Family dissolved; members detached; group owner’s child profiles/events deleted (see Settings copy for owners).

## 17.6 Notifications (family activity)

- **In-app:** **Shared inbox** — one notification list (group owner bucket); owner and members see the same messages and actions (confirm event/info, open entity).
- **Push:** **Separate delivery per member** (and owner); tap opens the same shared notification in-app.
- **Join:** Group owner notified when a member joins (and optionally which child profiles were merged). See implementation plan §15.

## 17.7 UI placement and terminology

- **Family Group** section on **Family Profile** (`profile.tsx`; menu may show “Family Profile”), below Child Information.
- Use **child profile**, **Child Seats**, **family group**, **group owner** in product copy (avoid “your vs owner’s” children).
- **User Profile** (`user-profile.tsx`): members do not see email-sync/forward controls.
