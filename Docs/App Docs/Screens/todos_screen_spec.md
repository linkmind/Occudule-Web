# To-dos Screen Specification

---

## Screen Header

### Top Left — Year Selector
- Displays the **current year** as a tappable element.
- Tapping it navigates the user to the **Yearly Calendar View** (see screenshot1 in the screen folder).

### Top Right — Action Icons

Two icons displayed right to left:

| Icon | Action |
|---|---|
| 🔍 Magnifying Glass | Opens **Global Search** (semantic search across to-dos and events) |
| ➕ Plus | Opens the **Add To-do** sheet (see [Add To-do](#add-to-do-sheet)). In the current app this is a floating **+** button (also offered from the empty-state hint). |

---

## Views

The To-dos screen supports three hierarchical views: **Yearly → Monthly → Daily**.

---

### Yearly Calendar View

Activated by tapping the **year number** in the header.

**Behavior:**
- Displays all 12 months in a yearly grid.
- **Today's date** is always highlighted with a colored background.
- Tapping any month navigates to the **Monthly View** for that month.

---

### Monthly View

Activated by tapping a month in the Yearly View, or as the default landing view.

**Behavior:**
- Tapping any date loads the **Daily To-dos List** for that day below the calendar.
- Each to-do is displayed with a status indicator and a deadline time.

---

### Daily To-dos List

Displayed beneath the monthly calendar when a date is selected.

**To-do Item Display:**

| Element | Description |
|---|---|
| Status Indicator | ⚫ Solid dot = completed / ⭕ Circle = not completed |
| To-do Title | Tappable — opens the detail surface for that to-do’s type (see below) |
| Deadline Time | Shown beside the to-do; tap to edit deadline (and assignee when family assignment is on). Independent of any parent event’s time. |

**Interactions:**
- Tapping the **status** control (○ / ✓) marks the to-do complete or incomplete.
- Tapping the **to-do title** depends on how it is stored (`is_standalone` when there is no `event_id` and no `info_email_id`):
  - **Standalone** → **To-do** sheet: edit child, deadline date/time, optional assignee, description; trash deletes the row. Does **not** open Event Detail.
  - **Event-related** (`event_id`) → **Event Detail** modal (to-dos can be ticked off inline). Time conflict UI: [Event Detail — time conflict](#event-detail--time-conflict).
  - **Info-related** (`info_email_id`) → **Info detail** modal (not created from this Add To-do sheet; those to-dos are added from Info confirmation / edit).
- Changing a to-do deadline never updates a parent event’s time.

**Empty state:** If no to-dos exist for the selected day, show a friendly message plus **Tap ➕ to add one**, which opens the same Add To-do sheet.

---

### Event Detail — time conflict

The **Event Detail** surface opened from a to-do must show the same **two-line** time conflict presentation as Home, Calendar, and Event Confirmation:

- **Line A:** Sibling / school (Occudule) — Yes/No, “Open the conflicting event,” failure message if not checked.
- **Line B:** External calendar — Yes/No, “View in external calendar,” URL/fallback/failure per provider.

Canonical behavior: [Product Spec §14](../Product_Spec.md#14-time-conflict-detection), field-level copy in [Email Confirmation Flow](../App%20Features/email_confirmation_flow_spec.md#event-confirmation-screen), and check range in [Settings §2.2](settings_screen_spec.md#22-event-conflict-check-range).

---

## Add To-do sheet

Opened by the floating **+** (or the empty-state hint). Title: **Add To-do**. The current app UI is the source of truth: `mobile/app/(tabs)/todos.tsx`.

The first control is **To-do type** (required before the rest of the form). Placeholder: **Please select a type**. Two options:

| Type (EN copy) | Meaning |
|---|---|
| **Add a standalone To-do** | A task for a child with its own deadline. **Not** linked to an event or Info email. |
| **Add an event-related To-do** | A task attached to an existing event, or created together with a new event. |

Save stays disabled until the fields for the chosen type are valid. Family groups on Premium/Diamond may also show **Assigned to**.

API: `POST /users/me/to-dos`. Exactly one of: `child_id` (standalone), `event_id` (event-related), or `info_email_id` (Info path — not this sheet). `child_id` is rejected if `event_id` or `info_email_id` is set.

---

### Standalone

Shown after the user picks **Add a standalone To-do**.

| Field | Required | Notes |
|---|---|---|
| Child | Yes | Roster children. Save is blocked until a child is selected. |
| Deadline date | Yes | Calendar day the to-do appears on the To-dos tab. |
| Deadline time | Yes | Does not belong to an event. |
| Assigned to | No | Family assignment only. |
| To-do details | Yes | Free text. |

**Save** creates a row with `child_id` set and `event_id` / `info_email_id` null.

---

### Event-related

Shown after the user picks **Add an event-related To-do**. Hint: select an event, or tap **Add New Event** to create an event and add to-dos there (the user does not need to return to this sheet).

| Field | Required | Notes |
|---|---|---|
| Event list | Yes to save here | Existing events (`GET /users/me/to-dos/events-for-picker`), filtered by the header child when one is selected. |
| **＋ Add New Event** | — | Tapping this row **immediately** closes the sheet and opens the [Add Event](addnewevent_screen_spec.md) screen (date + child query). To-dos added there are event-related. |
| Deadline date / time | Yes when saving against an existing event | Independent of the event’s start time. Prefills from the selected event, then the user can change them. |
| Assigned to | No | Family assignment only. |
| To-do details | Yes | Free text. |

**Save** (existing event selected) creates a row with `event_id` (child comes from that event). If no event is selected, the app prompts that an event is required (or to add a new event first).

---

### Other ways to-dos are created (not this sheet)

- **Add Event** / Event confirmation / Edit Event: to-dos saved with `event_id`.
- **Info confirmation / Edit Info:** to-dos saved with `info_email_id`.
- **AI extraction:** event or Info checklists per the extraction specs.

---

## Global Search

Activated by tapping the **🔍 magnifying glass** icon.

- Supports **semantic search** across all to-dos and events.
- Users can search by keyword, topic, or natural language query.

---

## Notes for Implementation

- Deadline times on to-dos are independent of event times — updating a to-do deadline must never modify the parent event's time.
- Status indicators must stay in sync between the list and Event Detail / Info detail when the to-do is linked.
- Standalone to-dos have no Event Detail; edit/delete is the standalone **To-do** sheet.
- Apply industry best practices for calendar navigation, empty states, and gesture handling.
- Extend or modify content as needed based on project requirements and evolving product needs.
- Refer to `home_screen_spec` for shared global header and bottom navigation bar behavior.
- Event Detail time conflict UI: see [Event Detail — time conflict](#event-detail--time-conflict) above and Product Spec §14.