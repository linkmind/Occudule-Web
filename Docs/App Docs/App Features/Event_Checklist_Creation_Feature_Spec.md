# Feature Spec: Event & Checklist Creation — Occudule

> This feature is the **write operation** of the backend. It takes the validated JSON output from the AI Email Analysis pipeline and populates the `events` and `to_dos` tables while maintaining full relational integrity across the user's profile.

---

## 1. Trigger Condition

```
AI Email Analysis completes successfully
  AND email_logs.processing_status = 'COMPLETED'
  AND AI JSON output is valid
    → Trigger Event & Checklist Creation pipeline
```

---

## 2. End-to-End Workflow

```
Step 1: Receive validated AI JSON output
  → Step 2: Relational Mapping
      → Match child_name   → resolve child_id   (children table)
      → Match institution_name → resolve inst_id (institutions table)
  → Step 3: Duplicate Check
      → Query email_logs for existing message_id
      → If already processed → abort, log warning, do not re-insert
  → Step 4: Conflict Check (Premium / Diamond only)
      → Query events table for time overlaps (same child or siblings)
      → Query parent's external Google / Outlook calendar for overlaps
      → If conflict found → flag for CONFLICT_ALERT notification
  → Step 5: Atomic DB Transaction
      → INSERT into events
      → INSERT into to_dos (one row per task)
      → UPDATE email_logs SET processing_status = 'COMPLETED'
      → On failure → ROLLBACK all, SET processing_status = 'FAILED'
  → Step 6: External Calendar Sync
      → Push new event to Google Calendar or Outlook (write)
      → Store returned external event ID in events.external_calendar_event_id
  → Step 7: Dispatch notifications
```

---

## 3. Relational Mapping

### Child Name → `child_id`

```ts
async function resolveChildId(
  childName: string | null,
  userId: string
): Promise<{ child_id: string; is_fallback: boolean }> {

  if (!childName) return { child_id: await getGeneralChildId(userId), is_fallback: true };

  const children = await db('children').where({ parent_id: userId });

  const match = children.find(c =>
    [c.first_name, c.preferred_name, c.nick_name]
      .filter(Boolean)
      .some(name => childName.toLowerCase().includes(name.toLowerCase()))
  );

  if (match) return { child_id: match.id, is_fallback: false };

  // Fallback: assign to General profile, notify parent to manually assign
  return { child_id: await getGeneralChildId(userId), is_fallback: true };
}
```

### Institution Name → `inst_id`

```ts
async function resolveInstitutionId(
  institutionName: string | null,
  childId: string
): Promise<string | null> {

  if (!institutionName) return null;

  const institutions = await db('institutions').where({ child_id: childId });

  const match = institutions.find(i =>
    institutionName.toLowerCase().includes(i.name.toLowerCase())
  );

  return match?.id ?? null;
}
```

---

## 4. Duplicate Prevention

Before any insert, verify the email has not already been processed:

```ts
async function isDuplicate(messageId: string, userId: string): Promise<boolean> {
  const existing = await db('email_logs')
    .where({ message_id: messageId, user_id: userId, processing_status: 'COMPLETED' })
    .first();
  return !!existing;
}

// Usage — abort early if already processed
if (await isDuplicate(emailLog.message_id, userId)) {
  console.warn(`Skipping duplicate: message_id ${emailLog.message_id}`);
  return;
}
```

---

## 5. Conflict Check (Premium / Diamond Only)

Runs before the DB write (or at read-enrichment time, depending on implementation). The product surfaces **two independent dimensions** — **sibling/school (Occudule)** vs **external calendar** — with separate Yes/No, links, fallbacks, and failure strings. See **[Product Spec §14](../Product_Spec.md#14-time-conflict-detection)**, [Settings — Event conflict check range](../Screens/settings_screen_spec.md#22-event-conflict-check-range), and [Email Confirmation — time conflict fields](email_confirmation_flow_spec.md#event-confirmation-screen).

**Implementation expectations:**

- Respect **Event conflict check range** (not an unbounded scan).
- External reads: **primary/default** calendar only; **batch** Graph/Google calls per user and time window; backoff on 429/503 per §14.
- The sample function below is **illustrative** — production code should return structured results per line (e.g. sibling result + external result + check status), not necessarily a single `ConflictResult`.

```ts
async function detectConflicts(
  userId: string,
  startTime: string,        // ISO 8601
  endTime: string | null,   // ISO 8601
  userPlan: 'FREE' | 'PREMIUM' | 'DIAMOND'
): Promise<ConflictResult | null> {

  if (userPlan === 'FREE') return null;

  const newStart = new Date(startTime);
  const newEnd   = endTime ? new Date(endTime) : new Date(newStart.getTime() + 60 * 60 * 1000); // default 1hr

  // Check all children's events for this parent
  const allChildren = await db('children').where({ parent_id: userId }).pluck('id');

  const conflictingEvent = await db('events')
    .whereIn('child_id', allChildren)
    .andWhere('event_date', newStart.toISOString().split('T')[0])
    .first();

  if (conflictingEvent) return { type: 'SIBLING_CONFLICT', event: conflictingEvent };

  // Check parent's external calendar (Google / Outlook)
  const externalConflict = await checkExternalCalendarConflict(userId, newStart, newEnd);
  if (externalConflict) return { type: 'PARENT_CALENDAR_CONFLICT', event: externalConflict };

  return null;
}
```

---

## 6. Database Writes

All inserts are wrapped in a single ACID transaction. If any step fails, the entire transaction rolls back — no partial or orphaned records are saved.

### 6.1 `events` Table — Fields to Insert

```ts
interface EventInsert {
  id:                        string;   // UUID, generated by DB
  child_id:                  string;   // resolved from child_name
  inst_id:                   string | null;  // resolved from institution_name
  event_name:                string | null;
  event_date:                Date | null;    // parsed from start_time
  event_time:                string | null;  // time portion of start_time (HH:MM:SS)
  location:                  string | null;
  summary:                   string | null;  // AI-generated
  reply_required:            boolean;
  original_email_link:       string;         // deep link to source email in Gmail / Outlook
  external_calendar_event_id: string | null; // populated after calendar sync (Step 6)
}
```

### 6.2 `to_dos` Table — Fields to Insert

One row per task in the AI output's `to_dos[]` array.

```ts
interface ToDoInsert {
  id:                  string;         // UUID, generated by DB
  child_id:            string;         // same child_id as parent event
  event_id:            string | null;  // linked to the event created above (if applicable)
  description:         string;         // task text, e.g. "Pack nut-free lunch"
  is_completed:        boolean;        // always false on creation
  deadline:            Date | null;    // from AI extraction deadline field
  action_link:         string | null;  // URL to permission form / sign-up page
  original_email_link: string;         // deep link to source email
  source:              'email' | 'attachment';  // tag if task came from an attachment
}
```

### 6.3 Full Transaction

```ts
async function createEventAndChecklists(
  aiResult:     AIExtractionResult,
  resolvedIds:  { child_id: string; inst_id: string | null },
  emailLog:     EmailLog
): Promise<{ eventId: string | null }> {

  let eventId: string | null = null;

  await db.transaction(async (trx) => {

    // 1. Insert event
    if (aiResult.event_name || aiResult.start_time) {
      const [event] = await trx('events').insert({
        child_id:            resolvedIds.child_id,
        inst_id:             resolvedIds.inst_id,
        event_name:          aiResult.event_name,
        event_date:          aiResult.start_time ? new Date(aiResult.start_time) : null,
        event_time:          aiResult.start_time ? aiResult.start_time.split('T')[1]?.split('Z')[0] : null,
        location:            aiResult.location,
        summary:             aiResult.summary,
        reply_required:      aiResult.reply_required ?? false,
        original_email_link: emailLog.id,
        external_calendar_event_id: null,   // updated after calendar sync
      }).returning('id');
      eventId = event.id;
    }

    // 2. Insert to-dos (one row per task)
    for (const todo of aiResult.to_dos ?? []) {
      await trx('to_dos').insert({
        child_id:            resolvedIds.child_id,
        event_id:            eventId,         // null if no event was created
        description:         todo.task,
        is_completed:        false,
        deadline:            aiResult.deadline ?? null,
        action_link:         aiResult.action_required?.link ?? null,
        original_email_link: emailLog.id,
        source:              todo.source ?? 'email',
      });
    }

    // 3. Mark email log as processed
    await trx('email_logs')
      .where({ id: emailLog.id })
      .update({ processing_status: 'COMPLETED' });

  }); // auto-rollback on any throw

  return { eventId };
}
```

---

## 7. External Calendar Sync

Triggered after a successful DB commit.

```ts
async function syncToExternalCalendar(
  eventId:  string,
  userId:   string,
  aiResult: AIExtractionResult
): Promise<void> {

  const user = await db('users').where({ id: userId }).first();

  const calendarPayload = {
    summary:  aiResult.event_name,
    location: aiResult.location,
    start:    { dateTime: aiResult.start_time },
    end:      { dateTime: aiResult.end_time ?? aiResult.start_time },
  };

  let externalEventId: string | null = null;

  if (user.email_host === 'GMAIL') {
    externalEventId = await pushToGoogleCalendar(userId, calendarPayload);
  } else if (user.email_host === 'OUTLOOK') {
    externalEventId = await pushToOutlookCalendar(userId, calendarPayload);
  }

  // Store the returned external event ID for future update/delete sync
  if (externalEventId) {
    await db('events')
      .where({ id: eventId })
      .update({ external_calendar_event_id: externalEventId });
  }
}
```

---

## 8. Event Deletion & Calendar Clean-up

When a parent deletes an event in the app, offer to also remove it from their external calendar.

```ts
async function deleteEvent(eventId: string, userId: string): Promise<void> {

  const event = await db('events').where({ id: eventId }).first();

  // 1. Delete from DB (cascades to to_dos via FK)
  await db('events').where({ id: eventId }).delete();

  // 2. Offer external calendar deletion if synced
  if (event.external_calendar_event_id) {
    const user = await db('users').where({ id: userId }).first();

    // Prompt the user in the app: "Also remove from Google/Outlook Calendar?"
    // If confirmed:
    if (user.email_host === 'GMAIL') {
      await deleteFromGoogleCalendar(userId, event.external_calendar_event_id);
    } else if (user.email_host === 'OUTLOOK') {
      await deleteFromOutlookCalendar(userId, event.external_calendar_event_id);
    }
  }
}
```

---

## 9. Automation Rules

| Rule | Implementation |
|---|---|
| **No duplicates** | Check `email_logs.message_id` before any insert — abort if `processing_status = 'COMPLETED'` already exists |
| **Attachment tagging** | Set `to_dos.source = 'attachment'` when task was extracted from an attachment, not the email body |
| **Fallback child profile** | If `child_name` cannot be resolved, assign to a "General" child profile and notify parent to manually reassign |
| **Atomic writes** | Events and To-Dos are always written in a single transaction — no To-Dos without a successful Event insert |
| **Calendar clean-up** | On event deletion, prompt user to also remove the synced external calendar entry |

---

## 10. Error Handling

| Failure | Behaviour |
|---|---|
| `child_name` doesn't match any child profile | Save to "General" child profile → push notification asking parent to manually assign |
| `institution_name` doesn't match any institution | Set `inst_id = null`, save record, continue |
| DB transaction fails (any step) | Full rollback → set `email_logs.processing_status = 'FAILED'` → log error |
| External calendar sync fails | Save DB records (do not rollback) → log sync failure → retry calendar sync separately |
| Duplicate `message_id` detected | Abort silently, log warning, do not create duplicate records |
| AI returns empty `to_dos` array | Create event only, skip To-Do inserts — valid state |
