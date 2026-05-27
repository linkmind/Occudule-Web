# Notification Center Screen Specification

---

## Screen Header

### Search
- A **🔍 magnifying glass** icon sits in the top-right corner of the header.
- Tapping it opens a **keyword search** across all notifications; results are displayed in a separate view.
- When the user **scrolls down**, the magnifying glass icon is replaced by a **persistent search bar** pinned to the top of the list for easier access.

---

## Notification List

### Layout

Notifications are displayed in cards sorted **latest to oldest**. In the top left corner of each card, please show the notification time. In the top right corner of the card, please show a label of "Discarded" if the user chose "No, discard" on the Event Confirmation Notification. the state is from the 5-line state list described in the email confirmation flow spec document. 


### Read / Unread Visual Treatment

| State | Style |
|---|---|
| Unread | **Bold** content in the row |
| Read | Regular (normal weight) content in the row |

### Grouping 

- Notifications are grouped by date. if there is a long list for certain date, then the date will be sticky or moving along when the user scrolls up and down so that the user can see which date an event belongs to. 


---

## Notification Detail (Pop-up)

- refers to the notification content section in the email_confirmation_flow_spec.md
- In addition to the notification content, also display the notification time to the left of the notification title with a "-" in between. 

---

## Bulk Actions

Users can select **one, multiple, or all** notifications to perform batch operations.

**Available bulk actions:**

| Action | Description |
|---|---|
| Mark as Read | Sets selected notifications to read (regular font) |
| Mark as Unread | Sets selected notifications to unread (bold) |
| Delete | Permanently removes selected notifications including those notifications labelled as "Discarded" |

**Selection UX best practices:**

- long press notification can activate selection mode with a square box appearing before the date and allow users to check that message or multiple messages. and the Bulk Action Bar shows up with options: Select All, Delete, Mark as Read or Mark as Unread in accordance with contextual.
- Allow users to **exit selection mode by clicking away** without performing any action.

---

## Notification Types

refers to email_confirmation_flow_spec.md

When a notification opens **Event Detail** or **Event Confirmation**, any **time conflict** presentation must follow the **two-line** model (sibling/school Occudule vs external calendar), links, fallbacks, failure strings, and Premium gating in **[Product Spec §14](../Product_Spec.md#14-time-conflict-detection)** — same as Home, Calendar, and To-dos → Event Detail.

---

## Notes for Implementation

- Apply industry best practices for notification centers, bulk selection UX, and empty states.
- Extend or modify content as needed based on project requirements and evolving product needs.
- Refer to `home_screen_spec` for shared global header and bottom navigation bar behavior.
