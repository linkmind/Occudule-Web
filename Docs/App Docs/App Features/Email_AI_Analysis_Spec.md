# Feature Spec: AI Email Analysis — Occudule

> Once an email passes the confidence scoring threshold (≥ 60), the AI Analysis engine transforms raw email text and attachments into structured data for the mobile app.

---

## 1. Processing Trigger

```
email_logs.confidence_score ≥ 60
  AND email_logs.processing_status = 'PENDING'
    → Enqueue AI extraction job via BullMQ
      → Run full AI Analysis pipeline
```

---

## 2. Input Data

The AI pipeline receives three categories of input, assembled by the backend before calling the model:

| Input Category | Fields |
|---|---|
| **Email components** | `subject`, `body` (plain text, HTML stripped), `sender`, `received_at` |
| **Attachment data** | Extracted text from PDF, images (OCR), Word, Excel, PowerPoint |
| **User context** | `preferred_language`, children's `first_name` / `preferred_name` / `nick_name`, registered institution names |

---

## 3. Extraction Requirements

The AI model (`gpt-4o`) must return all of the following fields in a single structured JSON response.

### 3.1 Identity

| Field | Type | Description |
|---|---|---|
| `child_name` | `string \| null` | Name of the child the email concerns (matched against user's children) |
| `institution_name` | `string \| null` | School, club, or organisation name |

### 3.2 Logistics

| Field | Type | Description |
|---|---|---|
| `event_name` | `string \| null` | Clear event title suitable for calendar display (e.g. "Spring Concert") |
| `start_time` | `ISO 8601 string \| null` | Event start date and time, UTC |
| `end_time` | `ISO 8601 string \| null` | Event end time if specified, UTC |
| `location` | `string \| null` | Physical address or digital link (e.g. "School Gym" or "https://zoom.us/...") |

### 3.3 Content & Summary

| Field | Type | Description |
|---|---|---|
| `summary` | `string` | 2–4 sentence plain-language summary of the email |
| `attachment_summary` | `string \| null` | Brief summary of attachment contents, merged into main summary if present |

### 3.4 Action Tracking

| Field | Type | Description |
|---|---|---|
| `to_dos` | `ToDo[]` | List of discrete, checkable tasks extracted from the email |
| `deadline` | `ISO 8601 string \| null` | Specific date/time a task or reply is due |
| `reply_required` | `boolean` | Whether the parent needs to reply to the email |
| `action_required.status` | `boolean` | Whether a web form, sign-up, or permission link is present |
| `action_required.link` | `string \| null` | Direct URL to the form or action page |

---

## 4. AI Prompt Template

```
You are an assistant that extracts structured information from school emails for parents.

The parent has the following children: {{children_list}}
The parent's registered institutions are: {{institutions_list}}
The parent's preferred language is: {{preferred_language}}

Extract all relevant information from the email below and return ONLY valid JSON.
Do not include any explanation, preamble, or markdown formatting.

Use this exact output schema:
{
  "child_name": "string | null",
  "institution_name": "string | null",
  "event_name": "string | null",
  "start_time": "ISO 8601 string | null",
  "end_time": "ISO 8601 string | null",
  "location": "string | null",
  "summary": "string (2-4 sentences)",
  "attachment_summary": "string | null",
  "to_dos": [
    { "task": "string", "completed": false }
  ],
  "deadline": "ISO 8601 string | null",
  "reply_required": true | false,
  "action_required": {
    "status": true | false,
    "link": "string | null"
  }
}

--- SUMMARY START ---
Subject: {{subject}}
From: {{sender}}
Date: {{received_at}}

{{body}}

{{attachment_text}}
--- SUMMARY END ---
```

---

## 5. Full Output JSON Schema

```json
{
  "child_name": "Emma",
  "institution_name": "St. Mary's School",
  "event_name": "Class Field Trip to Museum",
  "start_time": "2026-04-15T09:00:00Z",
  "end_time": "2026-04-15T15:00:00Z",
  "location": "Vancouver Science World",
  "summary": "The 3rd-grade class is visiting Science World on April 15. Students need to bring a packed nut-free lunch and wear their school spirit shirt.",
  "attachment_summary": "The attached permission slip requires a parent signature and confirms the $5 entry fee.",
  "to_dos": [
    { "task": "Pack nut-free lunch", "completed": false },
    { "task": "Wear school spirit shirt", "completed": false },
    { "task": "Sign and return permission slip", "completed": false }
  ],
  "deadline": "2026-04-10T23:59:00Z",
  "reply_required": false,
  "action_required": {
    "status": true,
    "link": "https://school-portal.com/permission-form"
  }
}
```

---

## 6. Processing Logic

### Step-by-step backend flow after AI response is received:

```
AI returns JSON
  → Step 1: Validate JSON structure (check all required fields present)
  → Step 2: Entity Resolution
      → Match child_name against children table (first_name / preferred_name / nick_name)
          → Resolve to child_id (UUID)
      → Match institution_name against institutions table
          → Resolve to institution_id (UUID)
  → Step 3: Action Detection (supplement AI result)
      → Scan body + attachment text for known URL patterns:
          - docs.google.com/forms
          - surveymonkey.com
          - school-specific portal domains (from institutions.email_domain)
      → If URL found and action_required.status is false → override to true, set link
  → Step 4: Write to database inside a single ACID transaction
      → INSERT into events (if event_name or start_time present)
      → INSERT into to_dos (one row per task in to_dos[])
      → UPDATE email_logs SET processing_status = 'COMPLETED'
  → Step 5: Trigger notifications (see Section 7)
  → On any failure: ROLLBACK transaction, SET processing_status = 'FAILED'
```

### Multilingual Handling

```
Extraction runs on the original email (subject + body). The AI "summary" field is stored in English on events.summary.
When the app loads home/calendar data, if users.preferred_language is not English, that summary is translated
on the fly (gpt-4o-mini) to the preferred language. No full translated email is stored in the database.
```

### Entity Resolution Logic

```ts
// After receiving AI JSON response
async function resolveEntities(
  aiResult: AIExtractionResult,
  userId: string
): Promise<{ child_id: string | null; institution_id: string | null }> {

  // Resolve child
  const children = await getChildrenForUser(userId);
  const matchedChild = children.find(c =>
    [c.first_name, c.preferred_name, c.nick_name]
      .filter(Boolean)
      .some(name => aiResult.child_name?.toLowerCase().includes(name.toLowerCase()))
  );

  // Resolve institution
  const institutions = await getInstitutionsForUser(userId);
  const matchedInstitution = institutions.find(i =>
    aiResult.institution_name?.toLowerCase().includes(i.name.toLowerCase())
  );

  return {
    child_id: matchedChild?.id ?? null,
    institution_id: matchedInstitution?.id ?? null,
  };
}
```

---

## 7. Notification Triggers

Fired immediately after a successful AI extraction and DB write:

| Condition | Notification Type | Priority | Content |
|---|---|---|---|
| `action_required.status === true` | `ACTION_REQUIRED` | 🔴 High | "Action needed: [event_name]" + direct link |
| New event detected (`event_name` present) | `EMAIL_RECEIVED` | 🟡 Medium | "New event added: [event_name] on [date]" |
| Time conflict detected (Premium / Diamond only) | `CONFLICT_ALERT` | 🔴 High | Push body may summarize overlap (e.g. sibling name or “external calendar”); **in-app** Event Detail / Confirmation use the **two-line** model in [Product Spec §14](../Product_Spec.md#14-time-conflict-detection) (sibling/school vs external). |
| `confidence_score` in grey area (40–59) | `EMAIL_RECEIVED` | 🟡 Medium | "Is this email school-related? Tap to confirm" |

### Notification dispatch logic

```ts
async function dispatchPostExtractionNotifications(
  extractionResult: AIExtractionResult,
  emailLog: EmailLog,
  userId: string,
  userPlan: 'FREE' | 'PREMIUM' | 'DIAMOND'
): Promise<void> {

  // 1. Action required (highest priority — always send)
  if (extractionResult.action_required.status) {
    await pushNotification(userId, {
      type: 'ACTION_REQUIRED',
      title: `Action needed: ${extractionResult.event_name ?? 'New email'}`,
      body: 'Tap to open the required form or link.',
      linked_entity_id: extractionResult.event_id,
    });
  }

  // 2. New event added
  if (extractionResult.event_name) {
    await pushNotification(userId, {
      type: 'EMAIL_RECEIVED',
      title: `New event: ${extractionResult.event_name}`,
      body: extractionResult.summary,
      linked_entity_id: extractionResult.event_id,
    });
  }

  // 3. Conflict detection (Premium and Diamond only)
  if (['PREMIUM', 'DIAMOND'].includes(userPlan) && extractionResult.start_time) {
    const conflict = await detectTimeConflict(userId, extractionResult.start_time, extractionResult.end_time);
    if (conflict) {
      await pushNotification(userId, {
        type: 'CONFLICT_ALERT',
        title: `Schedule conflict detected`,
        body: `${extractionResult.event_name} overlaps with ${conflict.event_name}`,
        linked_entity_id: extractionResult.event_id,
      });
    }
  }

  // 4. Grey area confirmation prompt
  if (emailLog.confidence_score >= 40 && emailLog.confidence_score < 50) {
    await pushNotification(userId, {
      type: 'EMAIL_RECEIVED',
      title: 'Is this email school-related?',
      body: 'Tap to confirm and process this email.',
      linked_entity_id: emailLog.id,
    });
  }
}
```

---

## 8. Database Writes After Extraction

All inserts happen inside a single transaction. If any step fails, the entire transaction rolls back.

```ts
async function saveExtractionToDatabase(
  aiResult: AIExtractionResult,
  resolvedIds: { child_id: string; institution_id: string },
  emailLogId: string
): Promise<void> {

  await db.transaction(async (trx) => {

    // 1. Insert event (if applicable)
    let eventId: string | null = null;
    if (aiResult.event_name || aiResult.start_time) {
      const [event] = await trx('events').insert({
        child_id:                   resolvedIds.child_id,
        inst_id:                    resolvedIds.institution_id,
        event_name:                 aiResult.event_name,
        event_date:                 aiResult.start_time ? new Date(aiResult.start_time) : null,
        event_time:                 aiResult.start_time ? aiResult.start_time.split('T')[1] : null,
        location:                   aiResult.location,
        summary:                    aiResult.summary,
        reply_required:             aiResult.reply_required,
        original_email_link:        emailLogId,
      }).returning('id');
      eventId = event.id;
    }

    // 2. Insert to-dos
    for (const todo of aiResult.to_dos ?? []) {
      await trx('to_dos').insert({
        child_id:            resolvedIds.child_id,
        event_id:            eventId,
        description:         todo.task,
        is_completed:        false,
        deadline:            aiResult.deadline ?? null,
        action_link:         aiResult.action_required.link ?? null,
        original_email_link: emailLogId,
      });
    }

    // 3. Mark email as processed
    await trx('email_logs')
      .where({ id: emailLogId })
      .update({ processing_status: 'COMPLETED' });
  });
}
```

---

## 9. Error Handling

| Failure Point | Action |
|---|---|
| AI returns malformed JSON | Retry once with same prompt; if still invalid → set `processing_status = 'FAILED'` |
| Entity resolution finds no matching child | Save record with `child_id = null`; flag for manual review |
| DB transaction fails | Full rollback; set `processing_status = 'FAILED'`; log error |
| Attachment parsing fails | Continue extraction on email body only; note in `attachment_summary` that processing failed |
| Translation API fails | Fall back to original text for extraction; log detected language |
