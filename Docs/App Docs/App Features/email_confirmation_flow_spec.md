# Email Confirmation Flow Specification

## Overview

The app processes incoming emails and triggers notifications based on a confidence score. There are **2 notification delivery channels**:

- **Push Notifications** (device-level)
- **In-App Notifications**

Both channels share the same **3 notification types**:
NOTE: this is a replacement taxonomy. the notification types here will overwrite the existing notification types in the App. Please make sure to make any changes necessary to be in line with the 3 new notification types.

1. Event Confirmation Notification
2. New Event Added Notification
3. Upcoming Event Notification

---

## Email Processing Flow

When an email arrives, the system scores it and routes it through one of three scenarios:

### Scenario 1 — Below Grey Area Score

- **Action:** No parsing, no processing, no notifications.

---

### Scenario 2 — In Grey Area Score


- **Action:** Push and generate an **Event Confirmation Notification**.

#### Notification Content

| Field    | Value                                                                           |
| -------- | ------------------------------------------------------------------------------- |
| Title    | Event confirmation needed                                                                        |
| Body     | Occudule detected an email that may be related to your child. Tap to view details. |

#### On Push Notification Tap → Navigate to: `Event Confirmation Screen`

> **Note:** This is a new screen that does not currently exist and must be built.

The current extraction flow needs to be changed as well. the current flow is the email will be extracted after the user confirms it is related to school. In the new flow, please change to if the email's confidence score falls in grey area, then the email will be extracted first and the extracted information will be populated into the Event Confirmation Screen.

---

## Event Confirmation Screen

### Introduction Text

> "Occudule detected a new event that may or may not be related to your child. Please review and confirm the information below:"

### Fields

the fields will be pre-populated with detected event information if possible. The user may modify the user-editable fields before confirming.

| Field            | Details                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Child Name**   | Pre-filled if detected. If not detected, show blank but with a **dropdown** listing all children. However, the user must select a child in order to save.|

| **Institution**  | Pre-filled from detected data.|

| **Event Name**   | Pre-filled from detected data.|

| **Reply Required** | `Yes` / `No`. If a reply is required based on the email and there is no drafted email reply stored in the database for this user, then display **Yes, Draft a Reply for me** with “Draft a Reply” as a hyperlink (diamond only). When the user taps the link, the AI could ask user 1-3 questions so that they can draft the reply based on the user's direction. if no questions for user or the user has answered all the questions, then AI directly opens the user's synced email account with the original email and a pre-drafted reply.
If there is already a drafted email reply stored in the database for this user, then show **Yes, Reply Drafted** with the “Reply” as a hyperlink (diamond only). When the user taps the link, the drafted reply shows up and allow the user to copy the text so that they can use it if needed.
If the reply is not required, then display **No**.|


| **Action Required** | `Yes` / `No`. If **Yes**: display the detected link. If **No**: display "No". (available for all users) |

| **Time conflict — sibling / school (Occudule)** | `Yes` / `No`. If **Yes**: show a link, e.g. **“Open the conflicting event”** (Premium+ opens the conflicting Occudule event; Free plan rules apply for navigation). If **No**: show **No**. If the check **fails** (e.g. enrichment error): show a manual-check message, e.g. *“School/sibling events couldn’t be checked. Please verify manually.”* |
| **Time conflict — external calendar** | `Yes` / `No`. If **Yes**: show **“View in external calendar”** linking to a web calendar URL where possible (Outlook: `https://outlook.office.com/calendar/` with optional week/day query from the conflict window; **no app deep links**). If a URL cannot be built reliably, still show **Yes** with fallback text, e.g. *“Overlaps something on your Outlook calendar”* (or Google-specific wording when that provider is enabled). If **No**: show **No**. If the check **fails** (token, missing calendar scope, API/rate limit after backoff): show e.g. *“External calendar couldn’t be checked. Please verify manually.”* |

> **Note:** Both lines are bounded by **Event conflict check range** in Settings (default 30 days, max 60 days). External checks use the parent’s **primary/default** calendar only (not shared calendars). **Google Calendar** uses the same UX pattern as Outlook with a separate OAuth scope and implementation (see Product Spec §14).

| **Other Fields** | Include all remaining standard event detail fields not listed above. |                                                                                                                                                                                                                                                                

### Bottom Action Buttons

Two mutually exclusive options displayed at the bottom of the screen:

1. **Yes, process**
   - Save all populated/modified field values to the database/backend.
   - Display the event on the frontend.
   - this notification will be shown as "Read" in the notification center.

2. **No, discard**
   - Do not create/show an event in UI; keep extracted data for future re-open.
   - Mark this notification in the notification center as Discarded (Discarded could be a label on top right corner of the notification card). If the user comes back and click the notification again in the notification center, then the saved extracted event information will show up again but it will be in the view-only mode.

#### On In-App Notification Tap → still navigate to: `Event Confirmation Screen`, but the content shows the user confirmed and saved event information. At the bottom of the screen, instead of "Yes, process" and "No, discard", it shows 2 buttons: Edit and Save. when screen just shows up, the edit button is active but the save button doesn't become active until the user hits the edit button. The fields on this screen will be not in edit mode until the user hits the edit button.


#### Grey-Area Email Lifecycle State Machine

Use the following canonical lifecycle states for grey-area emails:

| # | State | Description |
|---|-------|-------------|
| 1 | `GREY_DETECTED` | Email score falls in grey area; Event Confirmation Notification is created. |
| 2 | `PREVIEW_EXTRACTED` | AI extraction is completed; extracted preview data is available for Event Confirmation Screen. |
| 3 | `CONFIRMED_PROCESSED` | User taps **Yes, process**; event is committed and shown in UI; notification is marked Read. |
| 4 | `DISCARDED` | User taps **No, discard**; event is not created/shown in UI; preview data is retained for re-open; notification card shows **Discarded** label. |
| 5 | `EDITED_SAVED` | User re-opens a previously confirmed event, edits allowed fields, and saves updates. |

---

### Scenario 3 — Above Grey Area Score

- **Action:** Push and generate a **New Event Added Notification**.

#### Notification Content

| Field    | Value                                                                              |
| -------- | ---------------------------------------------------------------------------------- |
| Title    | New Event Added                                                                           |
| Body     | Occudule added a new event from an incoming email. Tap to view details.            |

#### On both Push and In-App Notification Tap → Navigate to: Event Details Screen

- This is the same event detail view shown when a user taps any event card in the Calendar tab.
- Users will be able to edit those fields that users have the authority to edit in the event details.
- A **Save button** must be present to persist changes.
- After the user tap the notification, the notification will be shown as "Read" in the notification center.

The classification of the fields related to events:
- user-editable content fields: Child name (dropdown menu) , Institution Name (dropdown menu) , event name , event date , event time , location , Summary, To-dos 
- system-computed/read-only fields:  Reply Required , original_email_link 
- regenerated fields: Time conflict (**sibling/school** line and **external calendar** line — see field table above; same two-line model on Event Details per Product Spec §14)
The users will only need to or have the authority to edit the first category (user-editable content fields), but no need or no authority to edit the second or third categories. if there is any field that is not listed here but is a part of the event details, you can classify them based on this classification logic/definition.  


---

## Upcoming Event Notification

### Notification Content

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Title    | Upcoming Event Reminder-[Event Date]                |
| Body     | [Child Name]-[Institution Name]:[Event name]         |

#### On Push and In-App Notification Tap → Navigate to: Event Details Screen

- Direct the user to the full event details for that event.
- if tapped, the notification will be shown as "Read" in the notification center.

---

## Summary of Screens to Build / Modify

| Screen                      | Status     | Notes                                                                 |
| --------------------------- | ---------- | --------------------------------------------------------------------- |
| Event Confirmation Screen   | 🆕 New     | Full new screen with editable pre-populated fields and 2 CTA buttons |
| Event Details Screen        | ✏️ Modify  | Add edit capability + Save button                                     |

