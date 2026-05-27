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
| ➕ Plus | Opens the **Add To-do** screen for the selected day |

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
| To-do Title | Tappable — opens the full **Event Detail** screen |
| Deadline Time | Shown beside the to-do; defaults to the event's time if no specific deadline is set |

**Interactions:**
- Tapping the **circle** marks the to-do as complete; the circle becomes a solid dot.
- Tapping the **to-do title** opens the Event Detail screen, which displays all event information and allows to-dos to be ticked off inline.
- The deadline time is **adjustable** per to-do; changing it does not update the parent event's time — it only sets a deadline for that specific to-do.

**Empty State:** If no to-dos exist for the selected day, display a friendly empty state message.

---

### Event Detail — time conflict

The **Event Detail** surface opened from a to-do must show the same **two-line** time conflict presentation as Home, Calendar, and Event Confirmation:

- **Line A:** Sibling / school (Occudule) — Yes/No, “Open the conflicting event,” failure message if not checked.
- **Line B:** External calendar — Yes/No, “View in external calendar,” URL/fallback/failure per provider.

Canonical behavior: [Product Spec §14](../Product_Spec.md#14-time-conflict-detection), field-level copy in [Email Confirmation Flow](../App%20Features/email_confirmation_flow_spec.md#event-confirmation-screen), and check range in [Settings §2.2](settings_screen_spec.md#22-event-conflict-check-range).

---

## Add To-do Screen

Opened by tapping the **➕ Plus** icon in the header.

**Fields & Controls:**

| Element | Description |
|---|---|
| Event Dropdown | Select an existing event or choose "Add New Event" |
| Time Picker | Set a **deadline** for this to-do (does not update the event time) |
| To-do Text Box | Free-text field to write the to-do details |
| Save Button | Saves the to-do; displayed below the text box |

**Flow:**
- **Existing event selected** → user fills in the to-do text box, then taps Save.
- **"Add New Event" selected** → navigates to a separate **Adding Event Screen** for the user to create a new event, then the flow goes back to monthly view. Adding To-do is done.

---

## Global Search

Activated by tapping the **🔍 magnifying glass** icon.

- Supports **semantic search** across all to-dos and events.
- Users can search by keyword, topic, or natural language query.

---

## Notes for Implementation

- Deadline times on to-dos are independent of event times — updating a to-do deadline must never modify the parent event's time.
- Status indicators (solid dot / circle) must stay in sync between the Daily To-dos List and the Event Detail screen.
- Apply industry best practices for calendar navigation, empty states, and gesture handling.
- Extend or modify content as needed based on project requirements and evolving product needs.
- Refer to `home_screen_spec` for shared global header and bottom navigation bar behavior.
- Event Detail time conflict UI: see [Event Detail — time conflict](#event-detail--time-conflict) above and Product Spec §14.