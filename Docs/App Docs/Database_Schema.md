# Database Schema — Occudule

> PostgreSQL database structure optimized for multi-child management and AI-driven data extraction.

---

## Entity Relationship Overview

```
Users
  ├── Subscriptions (via subscription_id)     — billing: owner's plan applies to whole family
  ├── Subscription_Logs (via user_id)
  ├── Email_Logs (via user_id)                — pipeline runs for family owner only
  ├── Notifications (via user_id)
  ├── Family_Groups (as owner_user_id)        — one owned group per owner (v1)
  ├── Family_Members (as user_id when joined)
  └── Children (via parent_id; also family_group_id)
        └── Institutions (via child_id)
        └── Events (via child_id + inst_id)
              └── To_Dos (via child_id + event_id)

Family_Groups
  ├── Family_Members (invites + active members)
  └── Children (via family_group_id; shared access)
```

---

## Table Definitions

### 1. `users`

Stores authenticated parent accounts.

```sql
CREATE TABLE users (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name           VARCHAR NOT NULL,
  last_name            VARCHAR NOT NULL,
  preferred_name       VARCHAR,
  email_address        VARCHAR UNIQUE NOT NULL,
  email_host           VARCHAR CHECK (email_host IN ('GMAIL', 'OUTLOOK')),
  preferred_language   VARCHAR DEFAULT 'English',  -- e.g. 'English', 'Chinese', 'French', 'Spanish'
  subscription_id      UUID REFERENCES subscriptions(id),
  billing_customer_id  VARCHAR,                    -- links local user to billing provider customer/app user records
  family_group_id      UUID REFERENCES family_groups(id) ON DELETE SET NULL,
  family_role          VARCHAR CHECK (family_role IS NULL OR family_role IN ('owner', 'member')),
  created_at           TIMESTAMP DEFAULT NOW()
);
```

> **Family billing:** Quotas and IAP entitlements resolve to the **family owner's** `subscription_id` / RevenueCat `app_user_id` for all active members. Members store their own `subscription_id` row but effective plan comes from the owner in application code (`FamilyAccessService.resolveBillingUserId`).

---

### 2. `subscriptions`

Defines plan tiers and their feature limits. Used by backend logic to enforce access control.

```sql
CREATE TABLE subscriptions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name                   VARCHAR CHECK (plan_name IN ('FREE', 'PREMIUM', 'DIAMOND')) NOT NULL,
  monthly_price               DECIMAL(6,2) NOT NULL,
  max_emails_per_month        INTEGER NOT NULL,   -- 8 = Free, -1 = Unlimited
  max_children                INTEGER NOT NULL,   -- 1 = Free, 2 = Premium, 4 = Diamond
  max_institutions_per_child  INTEGER NOT NULL,   -- 1 = Free, 3 = Premium, 6 = Diamond
  can_detect_conflicts        BOOLEAN DEFAULT FALSE,
  can_auto_reply              BOOLEAN DEFAULT FALSE,
  can_detect_actions          BOOLEAN DEFAULT FALSE  -- TRUE for all tiers in seed: forms / sign-up links / web actions (Product §4)
);
```

**Plan limits reference:**

| Plan | Price | Max Emails/mo | Max Children | Max Institutions/child | Conflict Detection | Auto Reply | Action detection |
|---|---|---|---|---|---|---|---|
| FREE | $0 | 8 | 1 | 1 | ❌ | ❌ | ✅ |
| PREMIUM | $3.99/mo · $39.99/yr | Unlimited (-1) | 2 | 3 | ✅ | ❌ | ✅ |
| DIAMOND | $5.99/mo · $59.99/yr | Unlimited (-1) | 4 | 6 | ✅ | ✅ | ✅ |

---

### 3. `children`

Child profiles managed under a parent account.

```sql
CREATE TABLE children (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_group_id UUID REFERENCES family_groups(id) ON DELETE SET NULL,
  first_name      VARCHAR NOT NULL,
  last_name       VARCHAR NOT NULL,
  preferred_name  VARCHAR,
  nick_name       VARCHAR,
  dob             DATE,
  grade           VARCHAR
);
```

> **Access:** API authorizes by `family_group_id` + active membership (`FamilyAccessService`), not only `parent_id`. `parent_id` remains the creating user (legacy/backfill).

---

### 3a. `family_groups`

One shared household per owner account (v1).

```sql
CREATE TABLE family_groups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Deleting the **owner** user cascades to `family_groups` and `family_members`; application code also clears member `family_group_id` / `family_role` before delete (`dissolveFamilyBeforeOwnerDelete`).

---

### 3b. `family_members`

Invites and memberships (owner row + invited adults).

```sql
CREATE TABLE family_members (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id    UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  user_id            UUID REFERENCES users(id) ON DELETE SET NULL,
  email              VARCHAR(255) NOT NULL,
  role               VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'member')),
  relationship_label VARCHAR(80),
  status             VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'revoked', 'left')),
  invited_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  invite_token       VARCHAR(255),
  invite_expires_at  TIMESTAMPTZ,
  joined_at          TIMESTAMPTZ,
  left_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Constraints (v1):** one active family per user; unique pending invite per `(family_group_id, lower(email))`. Migration: `046_family_groups.sql`.

---

### 4. `institutions`

Schools and other education institutions linked to a child.

```sql
CREATE TABLE institutions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  name          VARCHAR NOT NULL,    -- e.g. school name or club name
  email_domain  VARCHAR,             -- used for rule-based email filtering
  address       TEXT,
  email_address VARCHAR              -- Sender email whitelist (at frontend, user can add multiple emails based on different plans)
  keywords      TEXT[]               -- custom keywords for email detection
);
```

---

### 5. `email_logs`

Records every incoming email processed by the system.

```sql
CREATE TABLE email_logs (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider             VARCHAR CHECK (provider IN ('GMAIL', 'OUTLOOK')) NOT NULL,
  message_id           VARCHAR NOT NULL,       -- provider's unique message ID
  thread_id            VARCHAR,
  subject              TEXT,
  sender               VARCHAR,
  received_at          TIMESTAMP,
  processing_status    VARCHAR CHECK (processing_status IN ('PENDING', 'COMPLETED', 'FAILED')) DEFAULT 'PENDING',
  confidence_score     INTEGER,                -- AI classifier score; ≥50 = school email
  is_school_confirmed  BOOLEAN DEFAULT FALSE,  -- true if user manually confirmed a grey-area email (score 40–60)
  detected_language    VARCHAR,                -- optional future use
  body_plain           TEXT                    -- raw body for filtering/extraction (not exposed as user summary)
);
```

**Confidence score logic:**

| Score Range | Behaviour |
|---|---|
| ≥ 50 | Automatically classified as a school email → processed |
| 40–60 | "Grey area" → user is asked to manually confirm (`is_school_confirmed`) |
| < 40 | Ignored / not processed |

---

### 6. `events`

School events extracted from emails by the AI pipeline.

```sql
CREATE TABLE events (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id                  UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  inst_id                   UUID REFERENCES institutions(id) ON DELETE SET NULL,
  event_name                VARCHAR NOT NULL,
  event_date                DATE,
  event_time                TIME,
  location                  TEXT,
  summary                   TEXT,              -- AI-generated summary
  reply_required            BOOLEAN DEFAULT FALSE,
  original_email_link       VARCHAR,           -- deep link to the source email
  external_calendar_event_id VARCHAR           -- Google Calendar / Outlook event ID after sync
);
```

---

### 7. `to_dos`

Actionable checklist items extracted from emails or attachments.

```sql
CREATE TABLE to_dos (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id             UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  event_id             UUID REFERENCES events(id) ON DELETE SET NULL,  -- optional link to an event
  description          TEXT NOT NULL,
  is_completed         BOOLEAN DEFAULT FALSE,
  deadline             TIMESTAMP,
  action_link          VARCHAR,   -- URL to permission form, sign-up page, etc.
  original_email_link  VARCHAR    -- direct link to source email
);
```

---

### 8. `notifications`

Tracks all push alerts sent to the mobile app via FCM.

```sql
CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR NOT NULL,
  body              TEXT,
  type              VARCHAR CHECK (type IN (
                      'EMAIL_RECEIVED',
                      'EVENT_REMINDER',
                      'CONFLICT_ALERT',
                      'ACTION_REQUIRED'
                    )) NOT NULL,
  status            VARCHAR CHECK (status IN ('SENT', 'READ', 'DISMISSED')) DEFAULT 'SENT',
  linked_entity_id  UUID,   -- polymorphic: points to an Event or To-Do
  created_at        TIMESTAMP DEFAULT NOW()
);
```

---

### 9. `subscription_logs`

Source of truth for verifying a user's active subscription before processing emails. Updated by billing provider webhooks (RevenueCat, backed by Apple/Google IAP).

```sql
CREATE TABLE subscription_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider            VARCHAR CHECK (provider IN ('APP_STORE', 'PLAY_STORE', 'REVENUECAT')) NOT NULL,
  provider_customer_id VARCHAR NOT NULL,   -- provider customer / app user identifier
  transaction_id      VARCHAR UNIQUE,      -- unique provider transaction / event ID
  plan_type           VARCHAR CHECK (plan_type IN ('FREE', 'PREMIUM', 'DIAMOND')) NOT NULL,
  amount              DECIMAL(6,2),
  currency            VARCHAR(3),          -- e.g. 'USD', 'CAD'
  status              VARCHAR CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')) NOT NULL,
  period_start_date   TIMESTAMP,
  period_end_date     TIMESTAMP,           -- used to check expiry and grace period
  is_active           BOOLEAN DEFAULT FALSE -- quick-check flag for access control
);
```

> **Backend rule:** Always query `subscription_logs` to verify `is_active = TRUE` and `period_end_date > NOW()` before allowing email processing for a user.

---

## Security & Integrity Rules

### Row-Level Security (RLS)

Enable RLS on all tables so the API can only access rows belonging to the authenticated user:

```sql
-- Target policy (family-scoped) — migration 047_family_rls_policies.sql
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY children_isolation ON children
  USING (
    family_group_id IS NOT NULL
    AND family_group_id = (
      SELECT u.family_group_id FROM users u
      WHERE u.id = current_setting('app.current_user_id', true)::UUID
    )
  );
```

Similar `family_group_id` policies exist for `institutions`, `events`, and `to_dos` (via child). **Application layer:** `FamilyAccessService` enforces access while `PgRlsCompatService` may disable RLS on some tables in certain environments.

Apply user-scoped RLS to: `email_logs`, `notifications`, `subscription_logs` (owner bucket for family notifications).

### Cascading Deletes

All child records cascade-delete when the parent is removed:

```
users → children → institutions → events → to_dos
users → email_logs
users → notifications
users → subscription_logs
```

### ACID Transactions

Wrap the full AI extraction + DB write in a single transaction to prevent ghost/partial records:

```sql
BEGIN;
  INSERT INTO email_logs (...) VALUES (...);
  INSERT INTO events (...) VALUES (...);
  INSERT INTO to_dos (...) VALUES (...);
COMMIT;
-- If any step fails, ROLLBACK automatically — no partial data is saved
```

---

## TypeScript Types Reference

```typescript
type EmailHost = 'GMAIL' | 'OUTLOOK';
type PlanName = 'FREE' | 'PREMIUM' | 'DIAMOND';
type ProcessingStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
type NotificationType = 'EMAIL_RECEIVED' | 'EVENT_REMINDER' | 'CONFLICT_ALERT' | 'ACTION_REQUIRED';
type NotificationStatus = 'SENT' | 'READ' | 'DISMISSED';
type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  email_address: string;
  email_host: EmailHost;
  preferred_language: string;
  subscription_id?: string;
  billing_customer_id?: string;
  family_group_id?: string | null;
  family_role?: 'owner' | 'member' | null;
  created_at: Date;
}

interface FamilyGroup {
  id: string;
  owner_user_id: string;
  created_at: Date;
}

interface FamilyMember {
  id: string;
  family_group_id: string;
  user_id?: string | null;
  email: string;
  role: 'owner' | 'member';
  relationship_label?: string | null;
  status: 'pending' | 'active' | 'revoked' | 'left';
  invited_by_user_id?: string | null;
  invite_token?: string | null;
  invite_expires_at?: Date | null;
  joined_at?: Date | null;
  left_at?: Date | null;
}

interface Child {
  id: string;
  parent_id: string;
  family_group_id?: string | null;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  nick_name?: string;
  dob?: Date;
  grade?: string;
}

interface Institution {
  id: string;
  child_id: string;
  name: string;
  email_domain?: string;
  address?: string;
  keywords?: string[];
}

interface EmailLog {
  id: string;
  user_id: string;
  provider: EmailHost;
  message_id: string;
  thread_id?: string;
  subject?: string;
  sender?: string;
  received_at?: Date;
  processing_status: ProcessingStatus;
  confidence_score?: number;
  is_school_confirmed: boolean;
  detected_language?: string;
}

interface Event {
  id: string;
  child_id: string;
  inst_id?: string;
  event_name: string;
  event_date?: Date;
  event_time?: string;
  location?: string;
  summary?: string;
  reply_required: boolean;
  original_email_link?: string;
  external_calendar_event_id?: string;
}

interface ToDo {
  id: string;
  child_id: string;
  event_id?: string;
  description: string;
  is_completed: boolean;
  deadline?: Date;
  action_link?: string;
  original_email_link?: string;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body?: string;
  type: NotificationType;
  status: NotificationStatus;
  linked_entity_id?: string;
  created_at: Date;
}

interface SubscriptionLog {
  id: string;
  user_id: string;
  provider: 'APP_STORE' | 'PLAY_STORE' | 'REVENUECAT';
  provider_customer_id: string;
  transaction_id?: string;
  plan_type: PlanName;
  amount?: number;
  currency?: string;
  status: PaymentStatus;
  period_start_date?: Date;
  period_end_date?: Date;
  is_active: boolean;
}
```
