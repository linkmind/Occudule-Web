# Email Filtering Feature Spec — Occudule

> This document defines the multi-stage pipeline used to detect whether an incoming email is school-related before triggering full AI extraction.

---

## Complete Detection Pipeline

```
Incoming Email
  → Step 1: Domain Whitelist Filter
  → Step 2: Sender Email Whitelist
  → Step 3: Keyword Detection
  → Step 4: Child Name Detection
  → Step 5: AI Classifier (GPT-4o mini)
  → Confidence Score Calculation
      ├── Score ≥ 60  → Confirmed school email → Run full AI extraction
      ├── Score 40–60 → Grey area → Show "Is this school-related?" prompt to user
      └── Score < 40  → Ignored / not processed
```

---

## Step 1 — Domain Whitelist

Users set up known school domains in the app's Settings screen.

**Match rule:** If the sender's email domain matches any entry in the user's domain whitelist → mark as **high probability school email**.

```ts
// Example whitelist entries (stored in institutions.email_domain)
const domainWhitelist = [
  'school.edu',
  'myschool.org',
  'district.k12.ca',
];

// Match logic
function matchesDomainWhitelist(senderEmail: string, whitelist: string[]): boolean {
  const senderDomain = senderEmail.split('@')[1];
  return whitelist.some(domain => senderDomain === domain);
}
```

**Score on match: +50**

---

## Step 2 — Sender Email Whitelist

Used when a school or institution does not have its own private domain (e.g., uses Gmail or Outlook).

Users manually add specific contact email addresses in the Settings screen.

**Match rule:** If the sender's full email address exactly matches any entry in the whitelist → **auto-classify as school/institution email**.

```ts
// Example whitelist entries (stored per institution)
const senderWhitelist = [
  'school@gmail.com',
  'teachername@outlook.com',
];

function matchesSenderWhitelist(senderEmail: string, whitelist: string[]): boolean {
  return whitelist.includes(senderEmail.toLowerCase());
}
```

**Score on match: +30**

---

## Step 3 — Keyword Detection

Catches emails from **other parents** (e.g., birthday invitations) that won't match domain or sender whitelists.

Keywords are checked against both the **subject line** and **body text**.

### Default Keyword List

```ts
const defaultKeywords = [
  'field trip',
  'permission',
  'school event',
  'clothing',
  'volunteer',
  'sign up',
  'class party',
  'sports day',
  'play day',
  'school uniform',
  'bring lunch',
  'birthday invitation',
  'newsletter',
];
```

> Users can add custom keywords in the Settings screen. Custom keywords are stored in `institutions.keywords` (a `TEXT[]` column).

### Match Logic

```ts
function matchesKeywords(subject: string, body: string, keywords: string[]): boolean {
  const content = `${subject} ${body}`.toLowerCase();
  return keywords.some(keyword => content.includes(keyword.toLowerCase()));
}
```

**Score on match: +20**

---

## Step 4 — Child Name Detection

Increases confidence when the email references one of the user's registered children by name.

Child names (including preferred names, nicknames) are pulled from the `children` table (`first_name`, `preferred_name`, `nick_name`).

### Match Examples

```
"Emma's class trip"     → matches child "Emma"   → score +30
"Lucas field trip"      → matches child "Lucas"  → score +30
"Sophia homework"       → matches child "Sophia" → score +30
```

### Match Logic

```ts
function matchesChildName(subject: string, body: string, childNames: string[]): boolean {
  const content = `${subject} ${body}`.toLowerCase();
  return childNames.some(name => content.includes(name.toLowerCase()));
}
```

**Score on match: +30**

---

## Step 5 — AI Classifier (Final Step)

Only called if earlier steps have not produced a definitive result. This avoids unnecessary API calls for clear matches.

- **Model:** `gpt-4o-mini`
- **Input:** Email subject + body (plain text, max ~500 tokens)
- **Output:** JSON with a `classification` field

### Prompt Template

```
Classify this email.

Is this email related to a child's school activity, event, reminder,
permission form, schedule, or birthday invitation?

Return only valid JSON in this exact format:
{
  "classification": "school_email" | "not_school_email"
}

Subject: {{subject}}
Body: {{body}}
```

### Example

**Input:**
```
Subject: Field Trip Permission Form
Body: Please sign the permission form for the science museum trip this Friday.
```

**Output:**
```json
{
  "classification": "school_email"
}
```

**Score on `school_email`: +30**

---

## Confidence Scoring

Each detection layer contributes points to a cumulative confidence score.

| Signal | Points |
|---|---|
| School domain match (Step 1) | +50 |
| Known sender match (Step 2) | +30 |
| Keyword detected (Step 3) | +20 |
| Child name detected (Step 4) | +30 |
| AI classifier returns `school_email` (Step 5) | +30 |
| **Max possible score** | **160** |

### Score Thresholds

| Score Range | Action |
|---|---|
| ≥ 60 | ✅ Confirmed school email → trigger full AI extraction |
| 40–59 | ⚠️ Grey area → show "Is this school-related?" confirmation button in UI |
| < 40 | ❌ Not a school email → ignore / do not process |

### Grey Area UI Behaviour

When a score falls in the 40–59 range:
- App displays a prompt: **"Is this email school-related?"**
- User taps **Yes** → `email_logs.is_school_confirmed = TRUE` → proceed to full AI extraction
- User taps **No** → mark as ignored, do not process

### Scoring Example

```
Email from: parent@gmail.com
Subject: "Emma birthday invitation"

Step 1 - Domain whitelist:  no match  →  +0
Step 2 - Sender whitelist:  no match  →  +0
Step 3 - Keyword detection: "birthday invitation" matched  →  +20
Step 4 - Child name:        "Emma" matched  →  +30
Step 5 - AI classifier:     "school_email"  →  +30

Total score: 80 → ✅ Confirmed school email
```

### TypeScript Scoring Implementation

```ts
interface FilterResult {
  domainMatch: boolean;
  senderMatch: boolean;
  keywordMatch: boolean;
  childNameMatch: boolean;
  aiClassification: 'school_email' | 'not_school_email' | null;
  totalScore: number;
  decision: 'CONFIRMED' | 'GREY_AREA' | 'IGNORED';
}

function calculateScore(result: Omit<FilterResult, 'totalScore' | 'decision'>): FilterResult {
  let score = 0;
  if (result.domainMatch)                              score += 50;
  if (result.senderMatch)                              score += 30;
  if (result.keywordMatch)                             score += 20;
  if (result.childNameMatch)                           score += 30;
  if (result.aiClassification === 'school_email')      score += 30;

  const decision =
    score >= 60  ? 'CONFIRMED' :
    score >= 40  ? 'GREY_AREA' :
                   'IGNORED';

  return { ...result, totalScore: score, decision };
}
```

---

## Multilingual Translation

Extraction uses the original email text. The user-facing recap is a short English `summary` on `events`; when
`users.preferred_language` is not English, home API translates that summary at read time (not stored).

### Pipeline (simplified)

```
Incoming email text (subject + body)
  → Filter + AI extraction (summary stored in English on events.summary)
  → Display: translate summary only if preferred_language ≠ English
```

---

## Backend Implementation Checklist

- [ ] Fetch user's domain whitelist, sender whitelist, and custom keywords from DB before filtering
- [ ] Fetch all child names (first, preferred, nickname) for the user from the `children` table
- [ ] Run Steps 1–4 synchronously (no external API calls)
- [ ] Only call GPT-4o mini (Step 5) if score after Steps 1–4 is inconclusive (between 20–59)
- [ ] Store `confidence_score` and `processing_status` in `email_logs` after each email is evaluated
- [ ] For grey area emails (40–59): set `processing_status = 'PENDING'`, push notification to user for manual confirmation
- [ ] On user confirmation (`is_school_confirmed = TRUE`): re-trigger full AI extraction job via BullMQ queue
- [x] Translate stored AI summary at display time when preferred_language is not English
