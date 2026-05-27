# Notifications catalog

Reference for **in-app notifications** (Notifications tab), **server push** (Expo), and **local system alerts** (device-scheduled via `expo-notifications`). English copy is shown below; localized strings live in `backend/src/modules/notifications/notification-copy.ts` and `mobile/i18n/locales/`.

**Related docs:** [Screens/notification_center_screen_spec.md](Screens/notification_center_screen_spec.md), [App Features/email_confirmation_flow_spec.md](App%20Features/email_confirmation_flow_spec.md)

---

## Summary counts

| Channel | Active types | Notes |
|---------|--------------|--------|
| **In-app** (Notifications tab) | **6** | Stored in `notifications` table |
| **Server push** (Expo) | **5** | Same title/body as in-app for most types |
| **Local system alerts** | **4 variants** | Event Alert 1/2 + To-do Alert 1/2; not in Notifications tab |

---

## In-app notifications (6 types)

These appear in the Notifications tab. List rows use a **type label** (from i18n `notifications.type*`) plus a subtitle line where noted.

| Type | List label (EN) | Title (stored / push) | Body (EN) |
|------|-----------------|----------------------|-----------|
| **Event confirmation** | Event confirmation | `Event confirmation needed — {event name or subject}` | Occudule detected an email that may be related to your child. Includes a view-details marker for the detail pop-up. |
| **Info confirmation** | Info confirmation | `Info confirmation needed — {subject}` | Occudule detected an informational email that may be related to your child. Includes view-details marker. |
| **New event** | New event | `New Event Added — {event name}` | Occudule added a new event from an incoming email. Includes view-details marker. |
| **New info** | New info | `New Info Added — {subject}` | Occudule saved a new info email. Includes view-details marker. |
| **Family member joined** | Family member joined | `{display name} joined the family group` | `{email} · {relationship}` and optionally `Added: {child names}` |
| **To-do assigned** | To-do assigned | `To-do assigned to you` | **Pop-up:** `{First name} assigned you:` then to-do snippet on the next line. **List subtitle:** `{First name} assigned you a to-do` |

**To-do assigned UX:** Tapping the row opens a detail pop-up (title, body, **See details** button, **X** to close). **See details** navigates to the To-dos tab with the assigned item highlighted.

---

## Server push (5 types)

Push uses the same **title** and **body** as the in-app row when created via `NotificationsService.create()`, except:

| Type | Push? | Recipients |
|------|-------|------------|
| Event confirmation | Yes | Family notification recipients (owner + active members) |
| Info confirmation | Yes | Same |
| New event added | Yes | Same |
| New info added | Yes | Same |
| To-do assigned | Yes | **Assignee only** (not the assigner) |
| Family member joined | **No** | In-app only (`fanOutPush: false`) |

Push payload includes `notificationId`, `type`, and `linkedEntityId` when applicable. Tap routing is handled in `LocalNotificationTapHandler` and the Notifications screen.

---

## Local system alerts (4 variants)

Scheduled on the **device** at an exact time (deadline or event start minus user alert offsets). These do **not** create rows in the Notifications tab. Settings: **Event Alert 1 / 2** and **To-do Alert 1 / 2** (`Docs/Screens/settings_screen_spec.md`).

### Event reminders

| Alert | Title (EN) | Body (EN) |
|-------|--------------|-----------|
| **Alert 1** | `Upcoming: {event name}` | `{child name} — {institution name}` |
| **Alert 2** | `Starting soon: {event name}` | `{child name} — {institution name}` |

Implemented in `mobile/lib/eventReminderScheduler.ts`. Server cron for `UPCOMING_EVENT` is **disabled** to avoid duplicates.

### To-do reminders

| Alert | Title (EN) | Body (EN) |
|-------|--------------|-----------|
| **Alert 1** | `To-do due soon: {to-do description}` | Tap to view your to-do list. |
| **Alert 2** | `To-do due now: {to-do description}` | Tap to view your to-do list. |

Implemented in `mobile/lib/todoReminderScheduler.ts`. Fires for the **assignee** only (or standalone user when no assignee). Tap opens To-dos with `highlightTodoId`.

---

## Inactive / legacy types

| Type | Status |
|------|--------|
| `UPCOMING_EVENT` / `UPCOMING_EVENT_SECOND` | Server cron disabled; replaced by local event alerts. Old rows may still exist in the database. |
| `EMAIL_RECEIVED`, `CONFLICT_ALERT`, `ACTION_REQUIRED`, `EVENT_REMINDER`, `TASK_REMINDER` | Migrated to current taxonomy (see migration `023_notification_taxonomy_grey_preview.sql`). No longer sent. |

Legacy i18n keys (e.g. `typeEmailReceived`, `typeConflictAlert`) may remain in locale files but are not used for new notifications.

---

## Code references

| Area | Location |
|------|----------|
| Notification types (entity) | `backend/src/modules/notifications/entities/notification.entity.ts` |
| Server copy (EN + localized) | `backend/src/modules/notifications/notification-copy.ts` |
| Create + push | `backend/src/modules/notifications/notifications.service.ts` |
| To-do assigned | `notifyTodoAssigned()` in same service |
| Event local scheduler | `mobile/lib/eventReminderScheduler.ts` |
| To-do local scheduler | `mobile/lib/todoReminderScheduler.ts` |
| Notifications UI | `mobile/app/(tabs)/notification.tsx` |
| Mobile type labels | `mobile/i18n/locales/en.json` → `notifications.type*` |

---

*Last updated to reflect to-do assignment notifications, to-do local reminders, and to-do assigned pop-up UX.*
