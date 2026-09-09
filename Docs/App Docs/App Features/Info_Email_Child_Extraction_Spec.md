# Feature Spec: Child-scoped Info email extraction — Occudule

> Canonical product spec for how **Info** emails are extracted, matched to children on Family Profile, shown on the Info screen, and skipped (with notification) when nothing keepable remains.
>
> Related: [Email_AI_Analysis_Spec.md](Email_AI_Analysis_Spec.md), [Email_Filtering_Feature_Spec.md](Email_Filtering_Feature_Spec.md), [profile_screen_spec.md](../Screens/profile_screen_spec.md), [info_screen_spec.md](../Screens/info_screen_spec.md), [Notifications_Catalog.md](../Notifications_Catalog.md).

**Status:** Specified — implementation follows this document. Existing saved Info rows are not re-extracted unless a backfill is added later.

---

## 1. Goal

When an email is classified as **Info** (informational / non-calendar), Occudule must **not** recap the whole newsletter as one mixed blob. It **keeps the original email’s section order**, and **inside each section** it keeps:

1. Content that belongs to the parent’s children as listed on **Family Profile**, and
2. Content that applies to **all students** (no specific grade, child name, or teacher named).

Other-cohort facts (another grade, child, teacher, school, or program) are dropped. Empty sections after that filter are dropped. It then shows that recap on the **Info** screen as nested bullet points (one top-level bullet per kept original section).

Family Profile is the **roster** (who the children are, grade, school, other institutions, teacher names). The Info tab is the **reading surface**. Info emails are not listed on Family Profile.

---

## 2. When this applies

| Email classification | This spec |
|---|---|
| `email_type = INFO` (high confidence, auto-process) | **Yes** — keep original sections; inner child-specific + all-student filter; or skip-save + notify |
| `email_type = INFO` (grey area, confirmation) | Preview extraction should use the same keep/drop and summary-format rules; parent still confirms |
| `email_type = EVENT` | **No** — calendar extraction stays as today (prose summary, not this bullet outline) |

If both event and info content appear in one email, existing rule still applies: prefer **event** so the calendar flow is unchanged.

---

## 3. Family Profile inputs

Each child on Family Profile supplies matching signals:

| Signal | Source | Notes |
|---|---|---|
| Child name | `children.first_name`, `preferred_name`, `nick_name` | Same name set used in filtering |
| Grade | `children.grade` | Used for Info relevance (e.g. “Grade 3 spirit day”) |
| School / institution name | `institutions.name` (`is_school` or other) | Notices for a school the child attends are **kept** |
| Teacher’s names | UI field **Teacher’s Names** on school and on each other institution | Stored in `institutions.keywords` (`TEXT[]`). Comma-separated in the app. |

### 3.1 Teacher’s Names field (replaces Keywords)

On **School** and **Other Education Institutions**:

- **Label:** Teacher’s Names
- **Hint / placeholder:** Remind the user that this box is for the child’s teacher names (e.g. *Ms. Chen, Mr. Patel*). Occudule uses these names to match school emails to this child.
- **Storage:** Unchanged column `institutions.keywords`. Do not wipe existing values; users who previously typed freeform keywords keep them until they edit.
- **Filter pipeline:** Values still contribute to keyword scoring (plus the built-in default school-keyword list in code). See [Email_Filtering_Feature_Spec.md](Email_Filtering_Feature_Spec.md).

---

## 4. Relevance rules

Classify each distinct **topic** in the email (and in attachments) as one of:

| Class | Definition |
|---|---|
| **Child-specific** | Matches **any** of that child’s signals: name (first, preferred, or nickname); grade (single grade **or an inclusive range/list that contains that grade**, e.g. “Grade 4-7”, “G4 to G7”, “G4-6”, “4th-7th grade”, “G4/5/6/7”); school or other institution name; a teacher name listed on that child’s school or institution. |
| **All-student (general)** | Does **not** name a specific grade, child, or teacher. Includes whole-school / all-families / all-students / “all grades” notices, and unnamed policy, calendar, lunch, closure, or parking reminders meant for everyone. |
| **Other-cohort** | Names a **different** grade, child, teacher, school, or program than this child’s roster. Drop. |

### 4.1 Keep vs drop

Apply keep/drop **inside each original email section** (§4.3). Do **not** pull facts out of their section and regroup the whole email into a child-specific bucket followed by an all-student bucket.

**Keep** child-specific facts for the matching child, **and** all-student facts (those stay in their original section and appear on every child’s Info card — see §6).

**Drop** other-cohort facts. If a section has nothing keepable left, drop the **whole section** (heading, details, and that section’s links).

| Example | Outcome |
|---|---|
| “Emma is missing a library book” | Keep for Emma (name) |
| “Grade 3 spirit day Friday” | Keep for the Grade 3 child |
| “Grade 4-7 assembly” / “G4 to G7” / “G4-6” (child is Grade 6) | Keep for the Grade 6 child (range includes 6) |
| “Year 8 exam timetable” / “Year 12 formal” (child is Year 6) | Drop for that child (named other year) |
| “St. Mary’s closed Monday” | Keep for a child at St. Mary’s (school) |
| “Ms. Chen’s class needs extra pencils” | Keep for the child whose school/institution lists that teacher |
| “Soccer Club practice cancelled” | Keep if that club is on the child’s institutions |
| “Winter break: school closed Dec 20–Jan 3” (no grade, child, or teacher) | **Keep** as all-student; attach to **every** roster child |
| “All families: parking reminder” | **Keep** as all-student; attach to every roster child |
| “All grades / whole school photo day” | **Keep** as all-student (universal wording is not “a specific other grade”) |
| “Grade 5 camp forms due” | Drop unless a listed child is in Grade 5 |
| “Year group news” section with Grade 6 camp and Grade 9 exams (child is Grade 6) | Keep the section heading; keep Grade 6 camp; drop Grade 9 exams and that fact’s link |
| Other school, other teacher, unrelated program | Drop |

District or multi-school newsletters: keep sections for the child’s school and unnamed all-student sections; drop named other-school sections.

### 4.2 Body and attachments

Apply the **same** keep/drop rules **and** the **same** bullet + Related Link summary format (§5) to:

- the email-body Info `summary`
- the Info `attachment_summary` (attachment-only facts)

To-dos are created only for **kept** matters.

### 4.3 Original email sections (outer structure)

The newsletter’s own headings are the **outer** grouping. Child-specific vs all-student is only an **inner** filter.

| Rule | Detail |
|---|---|
| Walk top to bottom | One top-level outline bullet per **original heading/section** that still has keepable content for that child. |
| Do not merge headings | Do not combine Principal, Canteen, Uniform, etc. into one topic, even if several are all-student. |
| Mixed section | Keep the heading. Keep only child-specific (this child) + all-student facts inside it. Drop other-cohort facts (e.g. Grade 7 / 9 when the child is Grade 6) and links that belonged only to dropped facts. |
| Empty after filter | Drop the section entirely. |
| No headings | Treat the whole body as **one** section and apply the same keep/drop. |
| Links | URLs that appeared in the **kept** part of that section become `Related Link:` lines on **that** section. Do not invent links. Do not move a Canteen URL under Principal. |
| Per-child cards | Emma (Grade 3) and Liam (Grade 6) get separate rows. Same section **order**; inner content may differ. A section that is only Grade 6 does not appear on Emma’s card. |

**HTML input:** extraction must see headings and `href`s. Flattening HTML to a single line of text (stripping tags and collapsing whitespace) is not sufficient. Convert anchors to `anchor text (https://…)` and pass informational hyperlinks with their nearby heading — not only a handful of form/RSVP “action” links.

---

## 5. Summary format (Info screen)

Kept content is written for the parent in **clear English** (translated at read time when UI language is not English, same as today). Stored as a single `TEXT` outline (no schema change). **Event** summaries stay 2–5 sentences and do not use this outline.

### 5.1 Outline

- **One original section → one top-level bullet.** Use the email’s heading when present (not an invented catch-all title).
- **Details → sub-bullets** under that section. Include all important **kept** facts (what, who it applies to, dates, times, what to bring, deadlines, what the parent should do). **No cap** on number of sub-bullets or sentence length. Do not add an extra “Child-specific” / “All-student” heading inside the section.
- If the kept part of that section has one or more URLs, add **one line per URL** at the **bottom of that section**, after the detail sub-bullets. Each line uses the exact stored marker **`Related Link:`** followed by the URL. Do not invent links. Do not use the original link’s display text as the label.
- Several kept sections appear in **the same order as the original email** (not child-specific topics first, then all-student).
- Do not dump the whole newsletter. Drop other-cohort facts and empty sections.

Canonical stored example (Grade 6 child; a Grade 9 paragraph in “Year group news” was dropped):

```
• Principal’s message
  - Term starts 8 September
  Related Link: https://school.example/principal

• Year group news
  - Grade 6 camp forms due Friday
  Related Link: https://school.example/grade6-camp

• Canteen
  - Closed Monday
  Related Link: https://school.example/menu
```

`attachment_summary` uses this same outline when attachment text has kept topics.

### 5.2 Display

| Surface | Behavior |
|---|---|
| Info detail (and confirmation preview) | Parse the outline into nested bullets. Render each `Related Link:` line as a tappable control whose **visible label is always the words “Related Link”** (app i18n at display time; do not show the raw URL as the label). Multiple URLs on one topic → multiple Related Link rows. |
| Info list card / Home Info card | Short preview only (first topic title / first lines). Do not show the full outline. |
| Edit Info | Multiline text of the same stored outline so the parent can edit. |
| Older rows (paragraph text, no outline) | Show as plain text (no re-extract). |

Read-time translation must **preserve** top-level bullets, sub-bullets, URLs, and the English marker `Related Link:`. Translate topic titles and detail text only. The on-screen label is localized in the app.

`action_required.link` remains the single email-level action URL (forms, sign-up). Per-topic URLs live in the summary outline, not in that field.

---

## 6. Matching and persistence

### 6.1 Context sent to the model

For Info extraction, pass a **per-child roster**, not a flat name list. Example:

```
Emma — Grade 3 — St. Mary’s School (teachers: Ms. Chen, Mr. Patel); Soccer Club (teachers: Coach Rivera)
Liam — Grade 5 — St. Mary’s School (teachers: Mrs. Lopez)
```

Also pass a **section-preserving** body (headings and `anchor (url)` kept) and the email’s informational hyperlinks grouped by nearby heading. Do not send only a flattened plain-text blob plus the top few action URLs.

### 6.2 After extraction

Resolve **child-specific** facts to a Family Profile child using name, grade, institution, and teacher names (not name substring alone). Treat **all-student** facts as applying to **every** child on the roster — **in the original section where they appeared**, not appended as a second outline.

`child_extractions[].summary` is that child’s **complete** Info card: original sections in order, already filtered (this child’s specific facts + all-student facts in place). The server must **not** concatenate a global `all_student_summary` after that (except as a fallback if all-student headings are missing from the extraction).

`all_student_summary` is the original-section outline of **all-student-only** body content. Use it for roster children who have no child-specific extraction.

| Result | Persist |
|---|---|
| Only child-specific facts, one child | One `info_emails` row; that child’s kept original sections |
| Child-specific + all-student, one or more children | **One `info_emails` row per child**. Each row = that child’s complete outline in **original section order**. Emma’s library notice does **not** appear on Liam’s card. Shared sections (e.g. Canteen) appear on both, in the same relative order as the email. |
| Only all-student facts (no name/grade/teacher match) | **Save** — **one `info_emails` row per roster child**, each with the **same** all-student outline (still original section order) |
| Two or more children, mixed facts | Same as “child-specific + all-student”: one row per child; shared sections duplicated; child-specific sections only on the matching child |
| Only other-cohort facts (high confidence Info) | **Do not** insert `info_emails` or to-dos — see §7 |

Server matching must not skip-save solely because the email never mentions a child’s name, grade, school, or teacher. If keepable **all-student** content exists, persist per §6.2.

Unique constraint: allow multiple Info rows per source email, one per child (unique on `(email_log_id, child_id)` where both are set).

The Info screen child filter then shows only that child’s card.

Event emails are unchanged (still a single event path; unresolved child still uses the existing confirmation / preview flow).

---

## 7. High-confidence Info with nothing keepable — skip save, still notify

When extraction classifies the email as Info, confidence is **confirmed** (≥ 60), and **every** topic is other-cohort (no child-specific match **and** no all-student content):

**Do not:**

- create an `info_emails` row
- show anything on the Info tab
- create to-dos

**Do:**

- mark the `email_logs` row processed (`processing_status = COMPLETED`, `email_type = INFO`) so it is not extracted again
- create an **in-app** Notification Center row
- send a **push** notification to family notification recipients (same as other email alerts)
- provide a **link to open the original email** in Gmail/Outlook (same open-original pattern as Info/event detail)

### 7.1 Notification type: `INFO_SKIPPED`

Do **not** reuse `NEW_INFO_ADDED` (that type means the Info was saved).

| Field | Value |
|---|---|
| Type | `INFO_SKIPPED` |
| Title (EN) | `Info email skipped — {subject}` |
| Body (EN) | Occudule found an informational email, but it was about other grades, classes, or programs—not your children and not a whole-school notice—so it was not saved. Open the original email if you want to read it. |
| `linked_entity_id` | `email_logs.id` (not an info email id) |
| Push | Yes — owner + active family members |
| Tap | Notification detail; **Open original email** (mailbox). Do **not** navigate to the Info tab. |

Family **members** keep the existing privacy rule: they are told they cannot open the owner’s original mailbox.

Grey-area Info still uses **Info confirmation** (`INFO_CONFIRMATION`), not this skip path.

Full copy and tap routing: [Notifications_Catalog.md](../Notifications_Catalog.md).

---

## 8. Surfaces

| Surface | Behavior |
|---|---|
| Info tab (list + detail) | Child-filtered outline in **original section order**; detail uses nested bullets and Related Link (§5.2). The list is also filtered by **Daily / Weekly / All** on **received** local date (default Daily; All = anchored week’s Sunday through today + 120 days). See [Info screen spec](../Screens/info_screen_spec.md). |
| Home “email received today” (Info cards) | Same stored `summary`; list-style short preview |
| Info confirmation / edit | Same scoped outline; parent can still edit |
| Family Profile | Roster only (Teacher’s Names, grade, schools). No Info list |
| Notification Center | `NEW_INFO_ADDED` when saved; `INFO_SKIPPED` when skipped |

---

## 9. Out of scope

- Re-extracting historical `info_emails`
- Changing Event vs Info classification rules except Info keep/drop and Info summary format
- Putting Info content on the Family Profile edit screen
- Using grade in the **filter confidence score** (optional later; not required for this feature)
- Database migration of `summary` (stays `TEXT`)

---

## 10. Revision history

| Date | Change |
|---|---|
| 2026-08-26 | Initial child-scoped extract; skip-save + `INFO_SKIPPED`. |
| 2026-08-27 | Keep all-student topics (no named grade/child/teacher) in addition to child-specific; persist general-only mail as one Info row per roster child; nested bullet summaries with `Related Link:` (one line per URL); same format for `attachment_summary`; skip only when nothing keepable remains. |
| 2026-09-04 | Outer structure is the original email’s sections (order and headings). Child-specific + all-student is an inner filter only; other-cohort facts still dropped. Per-section links. HTML input must keep headings and hrefs. |
| 2026-09-09 | Info tab listing uses Daily / Weekly / All (received-date ranges). Documented in [info_screen_spec.md](../Screens/info_screen_spec.md); extraction rules unchanged. |
