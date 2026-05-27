# Manual Add New Event Screen Specification

## Overview

This screen allows users to manually input events and tasks that may not have been captured by the AI, or were received via paper or other non-digital channels.

- **UI Pattern:** Modal / Bottom Sheet
- **Triggered From:** Home screen, Calendar screen, or To-dos screen
- **Purpose:** Covers the gap between AI-extracted events and real-world events the user needs to add manually

---

## Sections

1. [Core Event Details](#1-core-event-details)
2. [Actionable Items (To-dos)](#2-actionable-items-to-dos)
3. [Details & Reference](#3-details--reference)
4. [Form Logic & Validation](#4-form-logic--validation)
5. [UI/UX Notes](#5-uiux-notes)

---

## 1. Core Event Details

These fields map directly to the `events` table in the database schema.

| UI Field | Database Mapping | Field Type | Required | Notes |
|---|---|---|---|---|
| **Child** | `child_id` | Dropdown | ✅ Yes | Select from children saved in the User Profile |
| **Event Name** | `event_name` | Text Input | ✅ Yes | e.g., "Science Fair", "Soccer Game" |
| **Date** | `event_date` | Date Picker | ✅ Yes | |
| **Time** | `event_time` | Time Picker | ❌ Optional | |
| **Location** | `location` | Text Input | ❌ Optional | e.g., "School Gym", "Community Centre" |
| **Institution** | `inst_id` | Dropdown | ❌ Optional | Pulls from the selected child's saved Schools / Other Education Institutions |

> **Note:** The **Save** button must remain disabled until `Child`, `Event Name`, and `Date` are all filled. See [Section 4](#4-form-logic--validation).

---

## 2. Actionable Items (To-dos)

This section allows users to add related tasks that will populate the `to_dos` table in the database.

### 2.1 To-do Items

- **UI:** A text input field with a **`+`** button to add multiple tasks per event.
- **Database Mapping:** `description` in the `to_dos` table.
- Users can add as many to-do items as needed.
- Each to-do item can be removed individually (e.g., swipe to delete or a `×` button).

### 2.2 Deadline

- **UI:** A date picker per to-do item, for task-specific deadlines.
- **Database Mapping:** `deadline` in the `to_dos` table.
- If left blank, the deadline defaults to the parent **Event Date**.

---

## 3. Details & Reference

### 3.1 Summary / Notes

- **UI:** Multi-line text area for additional context or free-form notes.
- **Database Mapping:** `summary` in the `events` table.
- Placeholder text suggestion: *"Add any extra details, instructions, or notes…"*

### 3.2 Reply Required

- **UI:** Toggle switch (On / Off).
- **Database Mapping:** `reply_required` (boolean) in the `events` table.
- **Default:** Off.
- When toggled On, this flags the event as requiring a response from the user (e.g., RSVP, permission slip reply).

### 3.3 Reference Link

- **UI:** Single-line text input for pasting a URL or reference link.
- **Database Mapping:** `original_email_link` in the `events` table.
- Placeholder text: *"Paste a link or URL for reference…"*
- If a URL is entered, display it as a tappable link after saving.

---

## 4. Form Logic & Validation

### 4.1 Smart Defaults

- If this screen is triggered while the user is viewing a **specific child's calendar**, the **Child** dropdown should be **pre-selected** to that child automatically.
- If triggered from the global Home (such as the user selects "All" meaning all children view), the Child dropdown defaults to empty (user must select).

### 4.2 Save Button Validation

The **Save** button remains **disabled** until all required fields are completed:

| Field | Required to Enable Save |
|---|---|
| Child | ✅ Yes |
| Event Name | ✅ Yes |
| Date | ✅ Yes |
| All other fields | ❌ Not required |

### 4.3 Conflict detection (background)

Upon selecting **Date** and **Time** (and as fields change), the app runs a **background** check aligned with [Product Spec §14](../Product_Spec.md#14-time-conflict-detection):

1. **Sibling / school (Occudule):** Overlap against other events for the same parent (all children), within the user’s **Event conflict check range** from [Settings §2.2](settings_screen_spec.md#22-event-conflict-check-range) (default **30** days, max **60** — not “Sync Status”).
2. **External calendar (Premium+):** Overlap against the parent’s **primary/default** connected calendar (Outlook and/or Google when implemented — **not** shared calendars). Use **batched** provider queries per time window where possible.

**UI on this screen (manual add):**

- Prefer **two compact lines** under Date/Time (or a single summary that expands): **School/sibling** and **External**, each with **Yes/No** (or clear icons) and optional short link text consistent with Event Confirmation (“Open the conflicting event” / “View in external calendar”).
- If only one dimension conflicts, show **Yes** only on that line.
- If a dimension **cannot be checked** (errors, missing calendar OAuth scope, rate limits after backoff), show the manual-check string for that line per §14 — do **not** show **No** for that line.
- Warnings are **informational only** — they **do not** block Save.

**If a sibling conflict is found:** optional inline ⚠️ plus tappable reference to the conflicting Occudule event where Premium rules allow.

**If an external conflict is found:** optional inline ⚠️ plus neutral “View in external calendar” link (Outlook web calendar URL pattern; no deep links) or fallback text per §14.

### 4.4 Success State

After the user taps **Save**:

1. Display a **Toast notification** confirming the event was saved (e.g., *"Event added successfully."*)
2. Dismiss the modal / bottom sheet.
3. Automatically **refresh** the relevant screens:
   - **Calendar screen** — updated to include the new event.
   - **Home screen** — updated to reflect the new event in the timeline.
   - **To-dos screen** — refreshed and updated if any to-do items were added.

---

## 5. UI/UX Notes

- **Time conflict** inline hints on this screen must stay consistent with [Product Spec §14](../Product_Spec.md#14-time-conflict-detection) and [Settings — Event conflict check range](settings_screen_spec.md#22-event-conflict-check-range) (see [§4.3](#43-conflict-detection-background)).
- The form should be presented as a **bottom sheet** that can be scrolled vertically if content exceeds the visible area.
- Use **section headers** to visually separate the three sections (Core Details / To-dos / Details & Reference).
- The **`+` button** for adding to-do items should always remain visible at the bottom of the To-dos section as the user adds items.
- **Keyboard behaviour:** The sheet should push up when the keyboard appears to ensure active input fields are never obscured.
- **Discard confirmation:** If the user attempts to close the modal after entering any data, display a confirmation prompt: *"Discard changes? Any unsaved information will be lost."* with options **Discard** and **Keep Editing**.
- All date and time pickers should use the **native platform picker** (iOS / Android) for consistency.

### Suggested Layout

```
┌───────────────────────────────────┐
│  ╳  Add New Event            [Save]│
├───────────────────────────────────┤
│  CORE DETAILS                      │
│  Child              [Dropdown  ▾]  │
│  Event Name         [__________]  │
│  Date               [📅 Pick Date] │
│  Time               [🕐 Pick Time] │
│  Location           [__________]  │
│  Institution        [Dropdown  ▾]  │
│                                    │
│  TO-DOS                            │
│  Task 1             [__________] ✕ │
│  Deadline           [📅 Pick Date] │
│  [+ Add another to-do]             │
│                                    │
│  DETAILS & REFERENCE               │
│  Notes              [            ] │
│                     [            ] │
│  Reply Required     [ Toggle ◯  ]  │
│  Reference Link     [__________]  │
└───────────────────────────────────┘
```
