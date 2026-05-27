# Home Screen Specification

## Global Header (All Screens)

The global header appears on all screens.

### Left: Child Selector
- Display the child's photo at the top-left corner (only if the user has uploaded one — no placeholder shown if no photo exists).
- To the right of the photo, display the **child's name** as a clickable element.
- On click, show a **dropdown menu** containing all children's names plus an "All" option.
- Selecting a child filters all on-screen content to that child's information.
- Selecting "All" shows all children's information combined. Use small, **color-coded tags** on events to indicate which child each event belongs to.

### Right: Profile Menu
- Display the word **"Profile"** in the top-right corner as a clickable trigger.
- On click, show a dropdown menu with the following options:
  - **Profile** — refer to `profile_screen_spec`
  - **Subscription** — plan, upgrade, restore, sync with server (IAP / RevenueCat)
  - **Billing Help** — store subscription settings, receipts guidance, support (no in-app invoices for IAP)
  - **About this App** — display product features from `product_spec`
  - **Settings** — refer to `settings_screen_spec`

---

## Bottom Navigation Bar (All Screens)

The bottom navigation bar is persistent across all main screens. Items:

| Label | Destination |
|---|---|
| Home | Home Screen |
| Calendar | Calendar Screen |
| To-dos | To-dos Screen |
| Notification | Notification Screen |

All items are tappable and navigate to the corresponding screen.

---

## Home Screen

The Home Screen contains two sections.

---

### Section 1: Today's Events — `[Today's Date]`

**Purpose:** Shows all events scheduled for today.

**Behavior:**
- Content refreshes automatically at **12:00 AM** each day.
- Events are sorted **chronologically** (earliest to latest).
- Cards maintain a **uniform height**; use a **"Show More"** control to open a **popup/modal** with full details.
- A **progress bar** appears below the section title, showing:  
  `[the number of completed To-dos] / [the number of total To-dos Today]`. Please also use color code to show: Red for 0-30%, Yellow for 31-70%, Green for 71-100%. the same color code applied to next section. 
- Each event card also includes its own **smaller progress bar**.

**Each Event Card displays:**

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
| Time conflict (compact) | Compact indicator on the card only — see [Time conflict presentation (Home)](#time-conflict-presentation-home). |

**Empty State:** If no events exist for today, display a friendly message letting the user know.

---

### Section 2: Events Received Today — `[Today's Date]`

**Purpose:** Shows emails received today containing event information.

**Behavior:**
- Content is cleared automatically at **12:00 AM** each day.
- Events are sorted by **email receipt time**, latest to oldest (receipt time is not displayed).
- Cards maintain a **uniform height**; tapping **"Show More"** opens a **popup/modal** with full details.
- Supports **Pull-to-Refresh** gesture to manually sync with the user's inbox.

**Each Event Card displays:**

| Field | Notes |
|---|---|
| Event Name | |
| Institution Name | |
| Sender | |
| Event Date | |
| Event Time | |
| Location | Only shown if content exists |
| Email Summary | Subject + main body summary |
| To-dos | |
| Link | Link to the original email |
| Reply Required | `"Yes, email drafted"` / `"Yes, no email drafted"` / `"No"` |
| Action Required | Extracted link (e.g. permission form, school portal, Google Sheet) |
| Time conflict (compact) | Same as Section 1 — see [Time conflict presentation (Home)](#time-conflict-presentation-home). |

**Empty State:** Display a `"You're all caught up!"` message with shortcuts to:
- **Add Manual Event**
- **Check Settings** (navigates to Settings Screen via the Profile menu)

---

## Time conflict presentation (Home)

**Canonical rules:** [Product Spec §14 Time Conflict Detection](../Product_Spec.md#14-time-conflict-detection), [Settings — Event conflict check range](settings_screen_spec.md#22-event-conflict-check-range), and the two-line field definitions in [Email Confirmation Flow](../App%20Features/email_confirmation_flow_spec.md#event-confirmation-screen).

### On event cards (both Home sections)

- Use a **compact** summary: e.g. combined **Yes/No** if **any** conflict exists (sibling and/or external), or two short labels (**School**, **External**) if the layout allows. Tooltips/accessibility strings should not imply a single monolithic “time conflict” when the product distinguishes two dimensions.
- Tapping **Show More** opens the **Event Detail modal**, which must show the **full two-line** model:
  - **Line A — Sibling / school (Occudule):** Yes/No, link (e.g. “Open the conflicting event”), failure copy if not checked.
  - **Line B — External calendar:** Yes/No, “View in external calendar” (Outlook web URL pattern, optional date query; no app deep links), fallback text if no URL, failure copy if not checked.
- **Premium vs Free:** Per §14 — navigation to conflicting Occudule event or external URL may require Premium/Diamond; Free users may see upgrade when appropriate.
- **Check range:** Respect the user’s **Event conflict check range** (default 30 days, max 60 days) for all conflict evaluation shown on Home.

---

## Notes for Implementation

- Follow all referenced spec files (`profile_screen_spec`, `settings_screen_spec`, `product_spec`) for linked screens.
- Apply industry best practices for subscription, billing, and empty states.
- Extend or modify content as needed based on project requirements and evolving product needs.
