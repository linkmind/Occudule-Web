# Calendar Screen Specification

---

## Weekly Events View

The main content area displays a **7-day weekly schedule**, dynamically starting on **Today**.

**Behavior:**
- Events under each day are sorted **chronologically** (earliest to latest).
- If a day has no events, display a `"No events"` message.
- All event cards maintain a **uniform height**.
- Each card includes a **"Show More"** control to to open a **popup/modal** with full details..
- **Today's date** is visually highlighted (e.g., distinct background color or border) so users can orient themselves immediately.
- Supports **horizontal swipe gestures** (left/right) to navigate between weeks, in addition to the navigation icons.

---

## Week Header (Above the Weekly Events View)

### Left Side — Week Label & Readiness

- Label: **"Weekly Events View"**
- Below the label: the **start date** and **end date** of the current week, separated by a dash  
  Format: `[Start Date] - [End Date]`
- Below the dates: a **"Readiness:"** label with a color-coded **progress bar** and a count:  
  `[Completed To-dos] / [Total To-dos]` for the displayed week

**Progress Bar Color Coding:**

| Completion | Color |
|---|---|
| 0% – 30% | 🔴 Red |
| 31% – 70% | 🟡 Yellow |
| 71% – 100% | 🟢 Green |

### Right Side — Navigation Icons

Five icons displayed left to right:

| Icon | Action |
|---|---|
| ⏮ One Month Backward | Shifts the weekly view back by one month; still shows 7 days |
| ◀ One Week Backward | Shifts the weekly view back by one week; still shows 7 days |
| 📅 Calendar | Opens a **monthly calendar modal** (see below) |
| ▶ One Week Forward | Shifts the weekly view forward by one week; still shows 7 days |
| ⏭ One Month Forward | Shifts the weekly view forward by one month; still shows 7 days |

### Today Button

A **"Today"** button is available at all times to return the weekly view to the current date in a single tap.

---

## Monthly Calendar Modal

Triggered by tapping the **Calendar** icon.

**Behavior:**
- Displays a full **monthly calendar view**.
- Users can navigate **one month backward or forward** using arrow icons.
- Tapping any date closes the modal and returns to the **weekly events view**, with the selected date's week in view.

---

## Time Conflict Indicator (Date-Level)

- If **any** event on that calendar day has a **time conflict** on **either** dimension — **sibling/school (Occudule)** and/or **external calendar** — display a **small red dot** on that date in the weekly view (and treat consistently in the monthly picker if applicable).
- The dot is a prompt to open event details; **full** breakdown (two lines, links, failure states) appears in the **Event Detail modal** per [Product Spec §14](../Product_Spec.md#14-time-conflict-detection).

---

## Event Card Fields

Each event is displayed on a card with the following fields:

| Field | Notes |
|---|---|
| Event Name | |
| Institution Name | |
| Event Time | |
| Location | Only shown if content exists |
| Email Summary | Subject + main body summary |
| To-dos | |
| Link | Link to the original email |
| Reply Required | `"Yes, email drafted"` / `"Yes, no email drafted"` / `"No"` |
| Action Required | Extracted link (e.g. permission form, school portal, Google Sheet) |
| Time conflict (compact) | Same compact rules as [Home — Time conflict presentation (Home)](home_screen_spec.md#time-conflict-presentation-home). **Show More** opens the modal with the **two-line** UI (sibling/school + external). |

---

## Time conflict presentation (Calendar)

Calendar list cards and the date-level dot follow the same **two-line** conflict model as Home and Event Confirmation. Normative copy, links, Outlook web URL behavior, fallbacks, failure messages, Premium gating, and **Event conflict check range** are defined in:

- [Product Spec §14](../Product_Spec.md#14-time-conflict-detection)
- [Settings — Event conflict check range](settings_screen_spec.md#22-event-conflict-check-range)
- [Email Confirmation — time conflict fields](../App%20Features/email_confirmation_flow_spec.md#event-confirmation-screen)

---

## Notes for Implementation

- Apply industry best practices for calendar navigation and gesture handling.
- Extend or modify content as needed based on project requirements and evolving product needs.
- Refer to `home_screen_spec` for shared global header and bottom navigation bar behavior.
