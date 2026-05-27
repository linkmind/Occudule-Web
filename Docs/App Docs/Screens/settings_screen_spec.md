# Settings Screen Specification

## Overview

The Settings screen provides users with controls for the following sections:

1. [Language](#1-language)
2. [Sync Status](#2-sync-status)
3. [Notifications](#3-notifications)
4. [Time Zone](#4-time-zone)
5. [Account Deletion](#5-account-deletion)

---

## 1. Language

### 1.1 Preferred Language

- Displayed as a **dropdown menu**.
- Available options include (but are not limited to):
  - English
  - French
  - Simplified Chinese
  - Traditional Chinese
  - Spanish

> Please add additional languages based on the best practice or common cases.

---

## 2. Sync Status

### 2.1 Email & Calendar Sync

- Users can view the current **email and calendar syncing status** directly in Settings.
- Status should clearly indicate whether syncing is active, pending, or failed.

### 2.2 Event Conflict Check Range

- Users can configure **how far ahead** the app checks for event time conflicts.
- **Default:** 30 days
- **Maximum:** 60 days
- Displayed as a dropdown or slider control.

| Setting | Value |
|---|---|
| Default range | 30 days |
| Maximum range | 60 days |

#### What this range applies to

- The selected range **bounds all time-conflict detection work**, not an unbounded scan of the user’s history.
- **Sibling / school (Occudule) overlap:** Only events whose dates fall within **from today through today + N days** (where N is the user’s setting) are considered when evaluating conflicts for any event shown in that context. The backend should batch work per user and per time window rather than issuing one remote call per event.
- **External calendar (Outlook / Google, Premium+):** Microsoft Graph / Google Calendar queries must use a window derived from the same **Event conflict check range** (e.g. overlap of “event date span being loaded” with `[now, now + N days]`), so usage stays predictable and respects Graph/API rate limits.
- Changing the range should take effect on the **next** refresh of calendar/home data (no need to promise instant retroactive re-evaluation unless the product later requires it).

---

## 3. Notifications

All notifications are delivered as **push/In-App notifications**.

### 3.1 Upcoming Event Notifications

Users can configure up to two event alerts:

| Alert | Description |
|---|---|
| Event Alert 1 | User sets how far in advance (before the event) the first alert is triggered |
| Event Alert 2 | User sets how far in advance (before the event) the second alert is triggered |

> Both alerts are optional. Time-before options should include common intervals (e.g., 5 min, 10 min, 15 min, 30 min, 1 hour, 1 day, 1 week).

---

## 4. Time Zone

- **Default:** Automatically set based on the user's **device/phone timezone setting**.
- Users can **manually override** the timezone via a dropdown selector.
- Timezone list should follow standard IANA timezone format (e.g., *America/Toronto*, *Asia/Shanghai*).

| Setting | Behavior |
|---|---|
| Auto-detect | Reads from device OS timezone |
| Manual override | User selects from a timezone dropdown |

---

## 5. Account Deletion

> **Compliance Note:** Both the Apple App Store and Google Play Store require apps to provide a clear **"Delete Account"** or **"Request Data Deletion"** option within Settings for privacy compliance (GDPR, CCPA, and platform policies).

### 5.1 Delete Account

- A clearly labeled **"Delete Account"** button or link must be present in Settings.
- Tapping it should trigger a **confirmation dialog** before proceeding (e.g., *"Are you sure you want to delete your account? This action cannot be undone."*).
- On confirmation, the following should occur:
  - All user data is permanently deleted from the backend.
  - The user is signed out and redirected to the onboarding/login screen.

### 5.2 Request Data Deletion

- An option to **"Request Data Deletion"** should also be available for users who want their data removed without immediately deleting their account (e.g., for regulatory requests).
- This can be implemented as a form submission or email trigger to the support team.

### 5.3 Data Deletion Scope

| Data Type | Deleted on Account Deletion |
|---|---|
| User profile (name, email) | ✅ Yes |
| Child information | ✅ Yes |
| Synced email/calendar data | ✅ Yes |
| App preferences & settings | ✅ Yes |

---
## 6. Legal

> **Compliance Note:** Both Apple App Store and Google Play Store require accessible links to Terms of Service and Privacy Policy.

### 6.1 Terms of Service

- Label: **Terms of Service**
- Display as a tappable link.
- *(Placeholder — URL to be added before launch)*

### 6.2 Privacy Policy

- Label: **Privacy Policy**
- Display as a tappable link.
- *(Placeholder — URL to be added before launch)*
- Must comply with GDPR, CCPA, and Apple/Google privacy requirements given the app collects email, calendar, and children's information.


## UI/UX Notes

- Group settings into clearly labeled sections with visual dividers or section headers.
- Use native controls where possible (dropdowns, toggles, sliders) for platform consistency.
- Destructive actions (account deletion) should be visually distinct (e.g., red text or button) and always require a confirmation step.
- Sync Status should show a **timestamp** of the last successful sync (e.g., *"Last synced: 5 minutes ago"*).
- Settings changes should either **auto-save** or provide an explicit **Save** button — be consistent throughout.
- Extend or modify content as needed based on project requirements and evolving product needs.

