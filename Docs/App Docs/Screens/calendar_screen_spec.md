# Calendar Screen Specification

The **Calendar** tab (Events) is the in-app schedule of school events. The current app UI is the source of truth.

This screen shares **Daily / Weekly / All** date-range chrome with the [Info screen](info_screen_spec.md). Labels and week-strip behavior are the same; what is listed and how dates are applied differ (see [Date modes](#date-modes-daily--weekly--all)).

Global header (child selector) and bottom navigation: [Home screen spec](home_screen_spec.md).

---

## Shared chrome (Daily / Weekly / All)

These controls sit at the top of the Calendar tab. Default mode on open is **Daily**.

### Segmented control

Three equal segments: **Daily** | **Weekly** | **All**.

| Action | Effect |
|---|---|
| Tap **Daily** | Switches to Daily **and** jumps the selected day to **today**, with the week strip anchored to **this week’s Sunday**. |
| Tap **Weekly** | Switches to Weekly. Keeps the current anchored week (does **not** jump to today). |
| Tap **All** | Switches to All. Keeps the current anchored week (does **not** jump to today). |

### Month / year trigger and Today

- **Month / year** (left): shows the month and year of the **anchored week’s Sunday**. Tap to open the [monthly calendar modal](#monthly-calendar-modal).
- **Today** (right): sets the selected day to today and the anchored week to this week’s Sunday. Does **not** change Daily / Weekly / All.

There are no separate month-back / month-forward icons on the screen; month navigation lives inside the modal.

### Week strip (Sunday–Saturday)

A 7-day strip with weekday letters (Sun–Sat) and date numbers. Weeks **always start on Sunday**.

| Control | Behavior |
|---|---|
| **‹ › week chevrons** | Shift the anchored week by 7 days in every mode. In All, this also moves the start of the All range (see below). Chevrons do **not** change Daily’s selected day until the user taps a day in the strip. |
| **Tap a day** | Only in **Daily**. Selects that calendar day and re-anchors the week to that day’s Sunday. |
| **Weekly / All** | The strip is dimmed and not tappable. In **Weekly** only, a small dot marks **today** when today falls in the visible week. |

There is **no** horizontal swipe between weeks.

---

## Date modes (Daily / Weekly / All)

Calendar days use the user’s timezone (profile timezone, or the device zone when the profile is unset / `auto`). Events are loaded with `GET /users/me/home/events?start=&end=` plus the header **child** filter (`childId` when a single child is selected).

The range is inclusive `YYYY-MM-DD` on `events.event_date`.

| Mode | Start | End | List |
|---|---|---|---|
| **Daily** | Selected calendar day | Same day | Time \| Events table for that day. Cards omit the event date. Sorted by start time. |
| **Weekly** | Sunday of the anchored week | Saturday of that week | Seven day sections (Sun–Sat). Each day is chronological. **Today**’s column is visually highlighted. Empty days show **No events**. |
| **All** | Sunday of the anchored week | **Today + 120 days** (same horizon as local event reminders) | One section per event date, oldest date first. Today’s section label is **Today, {date}**. Empty state: **No events from this week onward.** |

**All** is not “every event forever.” It starts at the anchored week’s Sunday (so week chevrons and the month picker move the window) and ends 120 days after today. If the user pages the week strip into the future so that start is after end, the list is empty.

**Child filter:** the global header child selector still applies. **All** children shows color-coded child tags on cards; a single child hides the tags and requests only that child’s events.

### Readiness banner

Below the week strip (and the calendar illustration):

| Mode | Title | To-dos counted |
|---|---|---|
| Daily | Daily Readiness | To-dos on events for the selected day |
| Weekly | Weekly Readiness | To-dos on events in the loaded week |
| All | All Readiness | To-dos on events in the loaded All range |

The ring is percent complete (0–30% low, 31–70% mid, 71–100% high). **View To-dos** opens the To-dos tab.

---

## Daily view

- Column headers: **Time** | **Events**.
- Time shows start, or start stacked over end when an end time exists.
- Empty: **No events**.
- **+** floating button opens Add Event with `date` = the selected day (and the header child when one is selected).

---

## Weekly view

- One block per day: weekday + short date, then that day’s event cards (`Show More` / See more).
- Date-level **red conflict dot** when any event that day has a time conflict (see [Time conflict](#time-conflict-indicator-date-level)).
- **+** prefills Add Event with **today** (not the week’s Sunday).

---

## All view

- Sections grouped by `event_date`, each with a date heading and cards (event date shown on the card).
- Conflict dot on the section heading when any event that day conflicts.
- **+** prefills Add Event with **today**.

---

## Monthly calendar modal

Opened from the **month / year** trigger.

**Behavior:**

- Full month grid, Sunday-first, with **‹ ›** to change month.
- Days that have events in the visible month show a marker dot (`GET /users/me/home/events` for that month).
- **Daily:** highlights the selected day. Tapping a date selects that day, anchors the week to its Sunday, and closes the modal.
- **Weekly** and **All:** highlight the anchored Sunday–Saturday. Tapping a date sets the anchored week to **that date’s Sunday** (selected day is set to that Sunday) and closes the modal.

---

## Time Conflict Indicator (Date-Level)

- If **any** event on that calendar day has a **time conflict** on **either** dimension — **sibling/school (Occudule)** and/or **external calendar** — display a **small red dot** on that date in Weekly (and on All section headers).
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
| Time conflict (compact) | Same compact rules as [Home — Time conflict presentation (Home)](home_screen_spec.md#time-conflict-presentation-home). **See more** opens the modal with the **two-line** UI (sibling/school + external). |

---

## Time conflict presentation (Calendar)

Calendar list cards and the date-level dot follow the same **two-line** conflict model as Home and Event Confirmation. Normative copy, links, Outlook web URL behavior, fallbacks, failure messages, Premium gating, and **Event conflict check range** are defined in:

- [Product Spec §14](../Product_Spec.md#14-time-conflict-detection)
- [Settings — Event conflict check range](settings_screen_spec.md#22-event-conflict-check-range)
- [Email Confirmation — time conflict fields](../App%20Features/email_confirmation_flow_spec.md#event-confirmation-screen)

---

## Deep links and notifications

The Calendar tab accepts route params:

| Param | Behavior |
|---|---|
| `openEvent` | Loads that event, switches to **Daily** on the event’s date, opens Event Detail, then clears the param. |
| `view` | `daily` \| `weekly` \| `all` — selects that date mode. |
| `date` | `YYYY-MM-DD` — sets selected day and anchored week. |

---

## Notes for Implementation

- Source of truth: `mobile/app/(tabs)/calendar.tsx` (`CalendarViewMode`, `ALL_EVENTS_HORIZON_DAYS = 120`).
- Shared date-filter chrome on Info: [Info screen spec](info_screen_spec.md).
- Refer to `home_screen_spec` for shared global header and bottom navigation bar behavior.
