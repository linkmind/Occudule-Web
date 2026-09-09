# Info Screen Specification

The **Info** tab is the reading surface for saved informational emails (newsletters, announcements, FYIs — not calendar events). The current app UI is the source of truth.

Extraction, child matching, skip-save, and summary format are specified in [Info Email Child Extraction](../App%20Features/Info_Email_Child_Extraction_Spec.md). This document covers **how the tab lists those saved rows**, including **Daily / Weekly / All**.

The date-filter chrome is the same as the [Calendar (Events) tab](calendar_screen_spec.md). What is filtered is **when the info email was received**, not an event date.

Global header (child selector) and bottom navigation: [Home screen spec](home_screen_spec.md).

---

## Shared chrome (Daily / Weekly / All)

These controls sit at the top of the Info tab. Default mode on open is **Daily**. Segment labels reuse Calendar copy: **Daily** | **Weekly** | **All**.

| Action | Effect |
|---|---|
| Tap **Daily** | Switches to Daily **and** jumps the selected day to **today**, with the week strip anchored to **this week’s Sunday**. |
| Tap **Weekly** | Switches to Weekly. Keeps the current anchored week (does **not** jump to today). |
| Tap **All** | Switches to All. Keeps the current anchored week (does **not** jump to today). |

### Month / year trigger and Today

- **Month / year** (left): month and year of the **anchored week’s Sunday**. Tap to open the monthly calendar modal.
- **Today** (right): selected day = today, anchored week = this week’s Sunday. Does **not** change Daily / Weekly / All.

### Week strip (Sunday–Saturday)

Weeks **always start on Sunday**.

| Control | Behavior |
|---|---|
| **‹ › week chevrons** | Shift the anchored week by 7 days in every mode. In All, this also moves the start of the All range. Chevrons do **not** change Daily’s selected day until the user taps a day in the strip. |
| **Tap a day** | Only in **Daily**. Selects that calendar day and re-anchors the week to that day’s Sunday. |
| **Weekly / All** | Strip is dimmed and not tappable. In **Weekly** only, a small dot marks **today** when today is in the visible week. |

There is **no** horizontal swipe between weeks. Pull-to-refresh reloads the current range.

---

## Date modes (Daily / Weekly / All)

Calendar days use the user’s timezone (profile timezone, or the device zone when the profile is unset / `auto`).

Info rows are loaded with `GET /users/me/home/info-emails?start=&end=&timezone=` plus the header **child** filter. The server compares **local received date**: `email_logs.received_at` in the user timezone, else `info_emails.created_at`. The list is capped at **100** rows.

| Mode | Start | End | List |
|---|---|---|---|
| **Daily** | Selected calendar day | Same day | Flat list of Info cards received that local day. Heading is the full weekday + date (e.g. Wednesday, September 9). Newest received first. |
| **Weekly** | Sunday of the anchored week | Saturday of that week | Flat list for the whole week (not grouped by day). Heading is **Week of {start} – {end}**. Newest received first. |
| **All** | Sunday of the anchored week | **Today + 120 days** (same horizon as Events All) | Grouped by received local date, oldest date first. Today’s section label is **Today, {date}**. Within a day, newest received first. Empty body: **No info emails from this week onward.** |

**All** is not an unbounded archive. It starts at the anchored week’s Sunday (week chevrons and the month picker move that start) and ends 120 days after today. Paging the strip into the future so that start is after end yields an empty list.

Daily / Weekly empty copy: title **No info emails yet**, body **Info emails accepted by Occudule will appear here.**

**Child filter:** the global header child selector still applies. **All** children shows color-coded child tags on cards; a single child shows only that child’s Info rows (plus rows with no `child_id`). The child filter does **not** replace Daily / Weekly / All — both apply together.

### Readiness banner

Same component as Calendar. To-dos counted are those linked to the **currently loaded Info rows** (not event to-dos).

| Mode | Title |
|---|---|
| Daily | Daily Readiness |
| Weekly | Weekly Readiness |
| All | All Readiness |

**View To-dos** opens the To-dos tab.

---

## Monthly calendar modal

Same interaction as Calendar:

- Sunday-first month grid; **‹ ›** change month.
- Marker dots on days that have Info in that month (same `info-emails` range API).
- **Daily:** highlights the selected day; tap selects that day.
- **Weekly** and **All:** highlight the anchored week; tap sets the anchored week to **that date’s Sunday**.

---

## Info cards

Each list card shows:

| Field | Notes |
|---|---|
| Child tag / name | Color tag when the header is **All** children |
| Subject | Falls back to “Info email” if empty |
| Institution name | If present |
| Summary preview | Short preview of the stored outline (original email sections; child-specific + all-student facts inside each) — [Info Email Child Extraction](../App%20Features/Info_Email_Child_Extraction_Spec.md) |
| To-do ring | Completed / total to-dos on this Info |
| See more | Opens the Info detail modal |

There is no add-Info FAB on this tab (Info is created from email confirmation / extraction, not manually from the list).

---

## Info detail

**See more** opens a detail sheet: nested bullet summary with **Related Link**, original email open, linked to-dos (toggle complete), edit, and delete. Edit navigates to the Info edit screen. Outline rules stay in the extraction spec.

---

## Notes for Implementation

- Source of truth: `mobile/app/(tabs)/info.tsx` (`CalendarViewMode`, `ALL_INFO_HORIZON_DAYS = 120`).
- Shared chrome with Events: [Calendar screen spec](calendar_screen_spec.md).
- Refer to `home_screen_spec` for shared global header and bottom navigation bar behavior.
