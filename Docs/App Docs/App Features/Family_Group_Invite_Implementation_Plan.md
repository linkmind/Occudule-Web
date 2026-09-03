# Family Group invite — implementation plan

**Status:** Phases 1–8 implemented (join paths for invitees with existing child profiles + notification push fan-out)  
**Last updated:** 2026-09-03  

This document defines **family group** membership: the account owner invites Gmail/Microsoft family members by email; invitees join via a **web flow**, then install the app. It records **locked product decisions** from product review and outlines backend, web, and mobile work.

> **Not the same as:** [Account_Email_Verification_Implementation_Plan.md](Account_Email_Verification_Implementation_Plan.md) (signup email confirmation) or [email_confirmation_flow_spec.md](email_confirmation_flow_spec.md) (school/event email grey-area flow).

---

## 1. Product summary

| Topic | Decision |
|--------|----------|
| **Purpose** | Let spouse/parents share one Occudule household: same children, events, todos, notifications. |
| **Who invites** | **Owner only** (original account that created the family). |
| **Invite channel** | Transactional email (Postmark) with link → **web** join flow → success screen → App Store / Play Store. |
| **Invitee email** | Must be **Gmail or Microsoft** domain (same allowlist as email/password registration). Apple Sign in with a non-Gmail/Microsoft address can create an owner account, but that address **cannot** be used as an invitee email. |
| **Invitee permissions** | **Same read/write** on shared family data as owner. |
| **Relationship label** | **Optional** (e.g. Spouse, Mom, Dad) — display only. |
| **Plan limits** | **FREE:** cannot invite. **PREMIUM:** 1 member. **DIAMOND:** up to 3 members (excluding owner). |
| **Subscription** | Tied to **owner only**. Members use the owner’s plan. **Only the owner** may purchase, upgrade, or downgrade via IAP (RevenueCat `app_user_id` = owner). Members who open Subscription are prompted that only the owner can change the plan. **Owner downgrade** applies to the whole family (members lose higher-tier limits/features with the owner). |
| **Email ingestion** | **Owner only:** inbox sync (Microsoft), forward-to-Occudule, forward contact, sender whitelist setup. **Members:** no email sync / forward / inbound setup. |
| **Calendar** | **Members may** connect Google/Outlook calendar OAuth for **writing events** and **time conflict detection** on shared data. |
| **Existing app user accepts invite** | They **give up** email-sync capabilities for that account; they **keep** calendar sync only (same as new members). |
| **Owner deletes account** | **Dissolve** family (members lose access; define data retention below). |
| **Member leaves** | **Remove membership** only; family and children remain under owner. |
| **In-app UI** | **Profile** screen (`profile.tsx`), **below Child Information**, section title **“Family Group”**. |

---

## 2. Roles and capabilities matrix

### 2.1 Roles

| Role | Who | Count |
|------|-----|--------|
| **Owner** | User who created the family (original registrant). Exactly one per family. | 1 |
| **Member** | Invited adult who accepted. | 0–3 by plan |

### 2.2 Capability matrix (locked)

| Capability | Owner | Member |
|------------|:-----:|:------:|
| View/edit children, institutions | ✅ | ✅ |
| View/edit events, todos, info emails | ✅ | ✅ |
| Notifications (in-app / push for family data) | ✅ | ✅ (see **§15**) |
| Edit **child profiles** (names, grade, schools, institutions) | ✅ | ✅ |
| Email sync (Microsoft Graph / related) | ✅ | ❌ |
| Forward mail to Occudule inbound address | ✅ | ❌ |
| Add Occudule forward address to contacts | ✅ | ❌ |
| Configure sender whitelist / primary sync email for ingestion | ✅ | ❌ |
| OAuth **calendar** connect (read/write events, conflict checks) | ✅ | ✅ |
| Invite / revoke / resend invites | ✅ | ❌ |
| Change family subscription (IAP purchase / upgrade / downgrade) | ✅ | ❌ (view plan only; tap → prompt: only owner can change plan — see §3) |
| Leave family | N/A (delete account dissolves) | ✅ |

**Enforcement:** Backend must reject member attempts at email-sync, forward-contact, inbound, and mail-processing endpoints even if the mobile UI hides them.

---

## 3. Subscription and billing

### 3.1 Effective plan (locked)

- **Source of truth:** Owner’s `subscription_id` / RevenueCat entitlements (after sync).
- **Single RevenueCat subscriber:** All IAP purchases use the **owner’s** `app_user_id` (same as today for solo owners). Members are never billed as separate subscribers while in a family.
- **Members** do not have a separate plan for **family quotas** (**Child Seats**, email processing monthly cap, institution limits, invite caps, etc.) — always evaluate against the **group owner’s** subscription while they are members (Options 1 & 2 in §14).

### 3.2 Members cannot change subscription (locked)

- **Members must not** complete IAP purchase, upgrade, downgrade, or Customer Center flows that change entitlements.
- **Mobile:** On Subscription / Billing (and any upgrade entry points), if `family_role === 'member'`:
  - Show **read-only** current plan (owner’s tier, e.g. “Your family is on Premium”).
  - On tap of upgrade/downgrade/manage buttons → **Alert / modal:** *“Only the family owner can change the subscription plan. Ask [owner name / owner email] to upgrade or manage billing.”*
- **RevenueCat SDK:** Configure member sessions so they do not present a purchase UI (e.g. do not call `purchasePackage` for members; optional: identify member with owner’s `app_user_id` only if needed for read-only entitlement check — prefer **server-driven** plan from `GET /users/me/subscription` resolved via owner).
- **Backend:** Reject member-initiated subscription-change endpoints with `403` + code e.g. `FAMILY_MEMBER_CANNOT_MANAGE_SUBSCRIPTION`.

### 3.3 Owner downgrade (locked)

- When the **owner** downgrades (or subscription lapses), the **entire family** immediately reflects the lower tier:
  - Lower invite caps (e.g. Diamond → Premium may require revoking excess members or blocking new invites until count fits).
  - Lower children/email/institution limits per existing quota rules.
- **No grandfathering** of member slots above the new plan cap: if the new plan allows fewer members than are active, **block the downgrade** in Customer Center / IAP until the owner removes members, **or** auto-revoke excess members — **recommend block downgrade with clear message** listing how many members must leave first.
- Members see the downgraded plan limits on next app open / subscription fetch (still read-only).

### 3.4 Invite limits by plan

| Plan | Max **active + pending** member invites (excluding owner) |
|------|-------------------------------------------------------------|
| FREE | **0** (UI disabled + API 403) |
| PREMIUM | **1** |
| DIAMOND | **3** |

Count `pending` invites toward the cap so owners cannot spam unlimited emails.

---

## 4. Data model (proposed)

### 4.1 New tables

**`family_groups`**

| Column | Notes |
|--------|--------|
| `id` | UUID PK |
| `owner_user_id` | FK → `users`, unique (one owned family per owner user in v1) |
| `created_at` | |

**`family_members`**

| Column | Notes |
|--------|--------|
| `id` | UUID PK |
| `family_group_id` | FK |
| `user_id` | FK → `users`, nullable until accepted |
| `email` | Normalized invite target |
| `role` | `owner` \| `member` |
| `relationship_label` | Optional varchar |
| `status` | `pending` \| `active` \| `revoked` \| `left` |
| `invited_by_user_id` | Owner at invite time |
| `invite_token` | Nullable after accept |
| `invite_expires_at` | e.g. 7 days |
| `joined_at` | |
| `left_at` | |

**Constraints (v1):**

- One **active** family membership per user (cannot be in two families).
- Unique pending invite per `(family_group_id, email)`.

### 4.2 Changes to existing tables

| Table | Change |
|-------|--------|
| `users` | `family_group_id` (nullable), `family_role` (`owner` \| `member` \| null for legacy backfill) |
| `children` | `family_group_id` NOT NULL after backfill (keep `parent_id` as creator/legacy; access via family) |

### 4.3 Backfill migration

1. For each existing user with children: create `family_groups` row, set user as **owner**, set `children.family_group_id`.
2. Users without children: still create a family on first child save, or on first invite — define single rule (recommend: create family when user completes first child OR at registration for consistency).

---

## 5. Authorization model

Replace checks of the form `child.parent_id === userId` with:

```text
userCanAccessFamilyData(userId, familyGroupId) :=
  EXISTS family_members
  WHERE family_group_id = familyGroupId
    AND user_id = userId
    AND status = 'active'
```

Use for: children, institutions, events, todos, notifications, home feeds, conflict checks (read paths).

**Email pipeline** (filter, extraction, inbound webhook, sync jobs): only run for **`owner_user_id`** of the child’s family.

**Calendar OAuth** endpoints: allowed for **owner and member**; calendar writes/conflict reads scoped to shared family events.

Update **RLS** policies in PostgreSQL to match `family_group_id` + membership (not only `parent_id`).

---

## 6. User flows

### 6.1 Owner — invite (mobile)

**Location:** `profile.tsx` → section **Family Group** (below Child Information).

1. Owner taps **Invite family member**.
2. Enter email (+ optional relationship).
3. Client validates Gmail/Microsoft domain (reuse `assertAllowedEmail` / `isAllowedEmailDomain`). Apple iCloud / Hide My Email addresses are **not** valid invitees.
4. `POST /family/invites` → Postmark email.
5. List shows **pending** / **active** members; actions: resend, cancel pending.

**FREE plan:** section visible but invite disabled with upgrade CTA.

### 6.2 Invitee — email

- **Subject:** `{Inviter name} invited you to the family group on Occudule`
- **Body (plain + HTML):** `{Inviter name} invited you to join the family group on Occudule.`
- **CTA:** “Join family” → `https://{API}/family/join?token=...`
- Expiry: **7 days** (configurable).

### 6.3 Invitee — web join (new user)

Hosted pages on API (same pattern as `/verify-email`, `/reset-password`):

| Step | Screen | Content |
|------|--------|---------|
| 1 | **Invite** | Inviter name, read-only **email**, optional relationship shown; **Next** |
| 2 | **Password** | Create password + confirm (same rules as registration); email verified implicitly via invite |
| 3 | **Success** | “You joined {Owner}’s family group.” Next: download app. **Download the App** → App Store (iOS) or Google Play (Android) from User-Agent or explicit buttons |

API: `GET /family/invites/preview?token=`, `POST /family/join/accept` with `{ token, password, confirmPassword }`.

**No JWT required** on web until optional future “open in app” deep link.

### 6.4 Invitee — web join (existing Occudule user)

1. Step 1 detects email already registered (`account_exists`).
2. If invitee has **no** child profiles → simple join (password sign-in or app accept) per §6.3 / §6.5.
3. If invitee **has** child profiles → **§14** choice screen (two paths) on **web and in-app** before accept completes.
4. **Password:** existing email/password users **sign in** (verify password; **does not** change password). OAuth-only users → accept in app after sign-in.
5. On accept (either path): membership `active`; **strip** member email-sync state — **keep** calendar connections if any.
6. Success + download app (optional if already installed).

> **Current build (pre–Phase 8):** may still block invite or accept when invitee has child profiles or solo family — replace with §14 when implemented.

### 6.5 Member — mobile app after install

- Log in with invite email/password.
- See **same children/events** as owner (read/write).
- **User profile:** hide/disable email sync, forward contact, inbound address UI; show **calendar connect** only.
- **Subscription screen:** read-only family plan (owner’s tier). No purchase UI; prompt if user tries to change plan (§3.2).

### 6.6 Member leaves family

- Settings or Family Group → **Leave family** → confirm.
- `POST /family/leave` → `status = left`, clear `users.family_group_id` / role.
- User retains their **user account** but loses access to shared data; reverts to empty/solo state (no children unless they had own children before join — v1: members typically have no solo children).

### 6.7 Owner deletes account

- Existing delete-account flow extended:
- Dissolve family: revoke all members, orphan handling — members lose access; children/events **deleted with owner** OR transferred — **recommend delete** (owner owns data) with warning in delete copy.
- Cancel pending invites.

---

## 7. API surface (draft)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/family` | JWT | Family summary, members, pending invites, limits |
| `POST` | `/family/invites` | JWT owner | Create invite + send email |
| `POST` | `/family/invites/:id/resend` | JWT owner | Resend email |
| `DELETE` | `/family/invites/:id` | JWT owner | Cancel pending |
| `DELETE` | `/family/members/:userId` | JWT owner | Revoke active member |
| `POST` | `/family/leave` | JWT member | Leave family |
| `GET` | `/family/invites/preview` | Public | Token → inviter, email, valid/expired |
| `POST` | `/family/join/accept` | Public | New user: password; existing: login + accept |

All owner-only routes verify `family_role === owner'` and plan invite quota.

---

## 8. Mobile UI — Family Group section

**File:** `mobile/app/profile.tsx` (**Family Profile** screen per [profile_screen_spec.md](../Screens/profile_screen_spec.md); route `/profile`, `/child-profile`).

**Placement:** New section **below** “Child Information” (after child dropdown / institutions block).

**Contents:**

- Section title: **Family Group**
- Owner: list members (name/email, relationship, status) + **Invite** button
- Member: list co-members + **Leave family** (no invite)
- Copy explaining: shared children/events; only owner’s email is processed; members can connect calendar
- Plan gate messaging for FREE / max invites reached

**Not** on `user-profile.tsx` unless product later moves it — current decision is **child profile** screen.

---

## 9. Edge cases

| Case | Behavior |
|------|----------|
| Invite non–Gmail/Microsoft email | 400 with same message as registration domain check |
| Invite self | 400 |
| Invite email already pending | Resend or “already invited” |
| Invite email already active member | 409 |
| Invite email in **another** family (active member elsewhere) | **409 at accept** for invitee — owner may still send invite |
| Invitee has existing child profiles | **No** block/warning for owner at invite (§14) |
| Invitee already in another family | **Block at invitee accept** only (not at owner invite) |
| Token expired | Web: ask inviter to resend |
| Owner downgrades below allowed member count | **Block downgrade** until owner removes enough members (or revoke excess — prefer block with message). Active members above new cap cannot stay without owner action. |
| Member taps Subscription / upgrade | In-app prompt: only owner can change plan; no IAP (§3.2) |
| Member tries subscription-change API | 403 `FAMILY_MEMBER_CANNOT_MANAGE_SUBSCRIPTION` |
| Member tries email sync API | 403 `FAMILY_MEMBER_EMAIL_SYNC_NOT_ALLOWED` |
| Second owner | Not allowed in v1 |
| Switch join path after accept | **Not allowed** (one-time choice per §14) |
| Owner sees which join path member chose | **Not required** (notify on join / profiles added — §15) |

---

## 14. Planned: Accept paths when invitee has existing child profiles

**Scope:** Phase 8. Applies when invitee already has an Occudule account with **one or more child profiles**. Shown on **web join** and **in-app** accept (same copy and rules). **One-time** choice — cannot switch later.

### 14.1 Inviting (group owner)

- Owner may **always** send invite — **no** error or warning if invitee already has child profiles.
- **Exception:** invitee who is already an active **member of another family** cannot **accept** until they leave (blocked at invitee step; owner not blocked from sending).

### 14.2 Option 1 — Join on the group owner’s plan

| | |
|--|--|
| **Label** | Join on the group owner’s plan |
| **Help** | Delete all **child profiles** on your account, then join the family group. You’ll use the **group owner’s plan** and shared household. You can add **child profiles** again under the family group. Email forwarding and inbox sync turn off; calendar connection stays on for conflicts and events. |

**Behavior (aligned with current member join):**

1. Invitee confirms **delete all child profiles** on their account (with confirmation).
2. If **no** child profiles exist → skip deletion step.
3. Join as **member**; `family_group_id` = group owner’s family; email ingestion off; calendar on.
4. Uses **group owner’s** subscription and **Child Seats** for any profiles added later.

### 14.3 Option 2 — Bring child profiles into the family group

| | |
|--|--|
| **Label** | Bring child profiles into the family group |
| **Help** | Move **child profiles** you choose into this family group. They use the **group owner’s plan** and **Child Seats**. Events, school messages, and to-dos move with each profile. Profiles you don’t bring must be **deleted** before you finish joining. |

**Child Seats check (group owner’s plan):**

- `available = max_child_seats − current_profiles_in_family_group`
- If invitee profile count **≤ available** → offer merge **all** (with confirmation).
- If invitee profile count **> available** → invitee **selects** which profiles to merge (up to `available`).
- **Every** remaining profile on the invitee account must be **deleted** (with confirmation) before join completes.

**Merge semantics:**

- **Re-home** selected profiles into the family group (keep same `child_id` so events, info emails, and to-dos stay attached).
- Set `parent_id` → **group owner**; `family_group_id` → owner’s family.
- **Institutions and sender whitelist** on merged profiles: **keep as stored** at merge time — **do not** auto-trim.
- **After merge:** enforce limits like **existing owner downgrade** (grandfather): data remains; **save** on child profile may fail until under plan caps; email filter may still use stored senders until edited (see subscription quota behavior in `subscription-quota.service.ts`).
- Invitee becomes **member** on **group owner’s plan** (same email/calendar rules as Option 1).

**Permissions after join (both options):**

- Member has **same** access as today’s family members: view/edit **child profiles**, events, info, to-dos (within family group scope).

**Post-join subscription (both options):**

- Member uses **group owner’s** plan for quotas; **cannot** change IAP (§3.2). *(Invitee’s former personal subscription is separate from family billing — they should cancel/manage it outside the family if no longer needed.)*

### 14.4 Copy examples (neutral)

- **Child Seats:** “This family group has **{available}** of **{max}** Child Seats available. You have **{count}** child profiles on your account.”
- **Delete remainder:** “Delete **{n}** remaining child profile(s) to continue?”
- **Confirm merge:** “Bring **{names}** into this family group? Related events, messages, and to-dos will move with each profile.”

### 14.5 Engineering notes (Phase 8)

- Persist join path on member row or user (e.g. `join_path: delete_all | merge_profiles`) for support — **not** shown in owner UI.
- **Atomic transaction:** merge + delete remainder + `completeMemberJoin`.
- Remove pre–Phase 8 blocks: invitee-as-owner-with-children at invite/accept (`family.service.ts`).
- Extend reminder scheduler to **family_group_id** scope (not only `parent_id = user`).
- QA: [Family_Group_QA_Checklist.md](Family_Group_QA_Checklist.md) §10.

---

## 15. Notifications (family activity) — locked for Phase 8

### 15.1 Family activity (events, info, to-dos, confirmations, reminders)

| Channel | Model |
|---------|--------|
| **In-app** | **Shared inbox (Plan A):** one notification store keyed to **group owner** `user_id`; owner and all members read the **same** list (`FamilyAccessService.resolveNotificationUserId`). Read/unread/delete apply to the **shared** list for everyone. |
| **Push** | **Per member:** each active member (and owner) with a push token receives a **separate** system notification. Payload references the **same** `notificationId` / `linked_entity_id` in the owner bucket. |
| **Tap push** | Opens app → existing Notifications routing → same shared row → **confirm** event/info or **open** if already confirmed (unchanged mobile behavior). |

**Fan-out triggers (Phase 8):** email-driven confirmations, new events/info, upcoming reminders, and member-created/edited family activity — push to **all** family members; **one** in-app row in owner bucket.

**Deduping:** one in-app row per logical event (e.g. per `email_log_id` for grey-area) in owner bucket; multiple pushes.

### 15.2 Join / merge (one-time)

| Event | Delivery |
|-------|----------|
| Member joined | **Group owner:** in-app (shared bucket) + push — e.g. “{Name} joined the family group.” |
| Profiles merged (Option 2) | **Group owner:** include merged **child profile** names in body (no path label). |
| Member welcome (optional) | **Member:** in-app + optional push. |
| Blocked accept (other family) | **Invitee** only on accept UI — no owner spam. |

### 15.3 Not family activity

- Owner subscription/billing changes — no member push.
- Member email sync / account settings — N/A for members (ingestion disabled).

### 15.4 Current build vs Phase 8

- **Today:** shared in-app bucket is largely implemented; **push** often only targets the user id passed to `NotificationsService.create` (typically owner for email pipeline). **Phase 8** adds explicit **push fan-out** to all members.

---

## 10. Implementation phases

### Phase 1 — Foundation ✅ (shipped)
- Migration `046_family_groups.sql` + entities + backfill
- `FamilyService.ensureOwnerFamily` (register, OAuth signup, child create)
- API: `GET /family`, `POST /family/invites`, resend, cancel, revoke member
- Postmark `sendFamilyInviteEmail` (join URL; web page is Phase 2)

### Phase 2 — Web join flow ✅ (shipped)
- `GET /family/join` HTML wizard (invite → password → success + store links)
- `GET /family/invites/preview?token=`, `POST /family/join/accept`
- New user: create password; existing user: sign in with password (OAuth-only accounts get guidance to use the app)
- On accept: member row activated, `sync_email` cleared, OAuth mail connections removed
- Env: `APP_STORE_URL`, `PLAY_STORE_URL` (defaults in code if unset)

### Phase 3 — Authorization refactor (done)
- `FamilyAccessService`: `canAccessChild`, `applyChildFamilyScope`, billing/notification owner resolution, `assertCanManageEmailSync`
- Wired into children, home, todos, event-conflict, email-filter/extraction, subscription quotas, notifications, users/oauth/email-sync guards
- Migration `047_family_rls_policies.sql` (RLS policies; app still uses service-layer checks while `PgRlsCompatService` disables RLS on some tables)
- Email pipeline (sync, share, forward contact, `sync_email` updates) restricted to **owner**; members retain calendar OAuth + shared data read/write

### Phase 4 — Mobile Family Group UI (done)
- `profile.tsx`: **Family Group** section (`FamilyGroupSection`) — invite, pending list, resend/cancel, revoke, leave
- `user-profile.tsx`: hide email sync + forward for `family_role === 'member'`; calendar-only connect via account email
- `familyApi` client; `POST /family/leave` for members

### Phase 5 — Subscription / RevenueCat (done)
- `RevenueCatSyncService.getSnapshotForUser` resolves billing user; `family_read_only` + owner contact on snapshot
- `syncSubscriberFromRevenueCat` uses owner `app_user_id`; members blocked via `assertCanManageSubscription`
- Owner downgrade blocked in `applySubscriberPayload` when active members exceed new plan cap
- `findMeForClient`: `calendar_integration_enabled` from billing user
- Mobile: `familySubscription.ts`, read-only Subscription/Billing/Customer Center for members; RC skips `logIn`/sync/restore for members; `useSubscriptionGate` backend-only for members; quota upgrade prompts route to owner alert

### Phase 6 — Existing user accept + cleanup (done)
- Web: existing email/password users sign in on join wizard; OAuth users directed to app
- `POST /family/join/accept-app` (JWT): in-app accept for signed-in users
- Mobile: `family-join` screen + deep link handler (`occudule://family/join?token=`)
- On join/leave/revoke: `teardownExternalIntegrationsForUser` + clear sync/OAuth mail state
- Owner delete: `dissolveFamilyBeforeOwnerDelete` clears members + pending invites; owner delete warning in Settings

### Phase 7 — Docs & QA (done)
- Updated [profile_screen_spec.md](../Screens/profile_screen_spec.md) (Family vs User Profile, Family Group section, member User Profile rules)
- Updated [Database_Schema.md](../Database_Schema.md) (`family_groups`, `family_members`, `users`/`children` columns, RLS notes)
- Updated [Product_Spec.md](../Product_Spec.md) (§17 Family Groups)
- Manual test matrix: [Family_Group_QA_Checklist.md](Family_Group_QA_Checklist.md)

### Phase 8 — Join paths + notification fan-out (shipped)
- §14: Option 1 (join on group owner’s plan) and Option 2 (bring child profiles into family group / Child Seats merge)
- §15: Shared in-app notification inbox + per-member push for family activity
- Remove invite/accept blocks for invitee with existing child profiles (except other-family at accept)
- See [Family_Group_QA_Checklist.md](Family_Group_QA_Checklist.md) §10

---

## 11. Test plan (high level)

Use **[Family_Group_QA_Checklist.md](Family_Group_QA_Checklist.md)** for step-by-step manual QA. Summary:

- [ ] FREE owner cannot invite (UI + API).
- [ ] PREMIUM: 1 pending + active member max; DIAMOND: 3.
- [ ] Invite `@gmail.com` / `@outlook.com` works; `@yahoo.com` rejected.
- [ ] Web flow: new user password → success → store link.
- [ ] Web flow: existing user login → accept → email sync disabled, calendar allowed.
- [ ] In-app accept: OAuth user via `family-join` / `accept-app`.
- [ ] Member sees owner’s children; can edit event.
- [ ] Member cannot call email sync / forward / inbound APIs.
- [ ] Owner email processing still works after member joins.
- [ ] Member calendar OAuth connects; conflict check runs.
- [ ] Member leaves → loses access.
- [ ] Owner deletes account → family dissolved, members lose access.
- [ ] Member opens Subscription → read-only plan; owner-only prompt; no purchase.
- [ ] Owner downgrade → family sees lower limits; blocked if too many members for new plan.
- [ ] **Phase 8:** See [Family_Group_QA_Checklist.md](Family_Group_QA_Checklist.md) §10.

---

## 12. Open engineering items

### Shipped (Phases 1–7)

1. ~~**Push notifications** to owner when member joins~~ — `FAMILY_MEMBER_JOINED` in-app + push on `completeMemberJoin` (migration `048_family_member_joined_notification.sql`).
2. ~~**Deep link** `occudule://family/join?token=`~~ — `FamilyInviteDeepLinkHandler`, `family-join` screen.

### Planned (Phase 8)

3. **Join paths §14** — Option 1 (delete all profiles → join on group owner’s plan) and Option 2 (merge profiles into family group with Child Seats selection).
4. **Notification fan-out §15** — shared in-app inbox + per-member push for family activity.
5. **Invite allowlist** — no owner-side block for invitee with existing profiles; accept-side block only for other-family membership.

---

## 13. Related code (today)

| Area | File / pattern |
|------|----------------|
| Family access / billing owner | `backend/src/modules/family/family-access.service.ts` |
| Family API + join | `family.service.ts`, `family.controller.ts`, `family-join-public.controller.ts` |
| Migrations | `046_family_groups.sql`, `047_family_rls_policies.sql` |
| Web join UI | `backend/src/family-join-page.ts`, `GET /family/join` |
| Child profile + Family Group UI | `mobile/app/profile.tsx`, `FamilyGroupSection.tsx` |
| Member User Profile | `mobile/app/user-profile.tsx` |
| In-app join | `mobile/app/family-join.tsx`, `FamilyInviteDeepLinkHandler.tsx` |
| Member subscription | `mobile/lib/familySubscription.ts`, `RevenueCatContext.tsx` |
| Child creator (legacy) | `children.parent_id` |
| RLS | `011_rls_policies.sql`, `047_family_rls_policies.sql` |
| Email domain allowlist | `AuthService.assertAllowedEmail`, `mobile/lib/authValidation.ts` |
| Postmark transactional | `postmark-transactional.service.ts` |
| Subscriptions | `subscription-quota.service.ts`, `revenue-cat-sync.service.ts` |

---

*Update this plan when product rules or IAP behavior changes.*
