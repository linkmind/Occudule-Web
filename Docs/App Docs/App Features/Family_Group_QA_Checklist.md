# Family Group — QA checklist

**Purpose:** Manual regression for family invite, membership, billing, and dissolve flows.  
**Prerequisites:** Migrations `046_family_groups.sql` and `047_family_rls_policies.sql` applied; Postmark configured for invite emails; `FAMILY_JOIN_WEB_BASE_URL` / store URLs set for web join.

**Related:** [Family_Group_Invite_Implementation_Plan.md](Family_Group_Invite_Implementation_Plan.md)

---

## Setup

| Item | Notes |
|------|--------|
| Owner account A | Gmail or Microsoft; plan tier under test (FREE / PREMIUM / DIAMOND) |
| Invitee B | Separate Gmail/Microsoft mailbox |
| Invitee C (optional) | For capacity / multi-member tests |
| API + mobile | Staging or local with matching `EXPO_PUBLIC_API_URL` |

---

## 1. Invite limits and domains

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 1.1 | FREE cannot invite | Owner on FREE → Child Profile → Family Group | Upgrade CTA; invite disabled; `POST /family/invites` → 403 |
| 1.2 | PREMIUM cap = 1 | PREMIUM owner; invite one member (pending or active) | Second invite blocked (UI + API) |
| 1.3 | DIAMOND cap = 3 | DIAMOND owner; add 3 pending+active total | Fourth invite blocked |
| 1.4 | Gmail invite | Invite `user@gmail.com` | Email sent; web join works |
| 1.5 | Microsoft invite | Invite `user@outlook.com` (or live/hotmail) | Email sent; web join works |
| 1.6 | Reject Yahoo | Invite `user@yahoo.com` | 400; same domain message as registration |
| 1.7 | Invite self | Owner invites own email | 400 |
| 1.8 | Duplicate pending | Invite same email twice | Resend or conflict; no duplicate pending row |

---

## 2. Web join

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 2.1 | New user | Open join link → create password → success | Account created; member active; store links shown |
| 2.2 | Existing password user | `account_exists` → sign in with password | Join success; no duplicate user |
| 2.3 | OAuth-only existing | Preview shows account exists; password path | Message to use app; no password-only accept |
| 2.4 | Expired token | Wait past expiry or invalidate token | Invalid/expired message |
| 2.5 | Email sync stripped | After join, sign in as member in app | User Profile: no email sync UI; `sync_email` null |

---

## 3. In-app accept

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 3.1 | Deep link | Open `occudule://family/join?token=...` (or staging scheme) | `family-join` screen with preview |
| 3.2 | OAuth accept | Sign in with Google/Microsoft as invitee → Accept | `POST /family/join/accept-app` success; `family_role=member` |
| 3.3 | Wrong account | Signed in as different email than invite | Error: wrong account |
| 3.4 | Login redirect | From family-join → Sign in → password login | Returns to family-join; accept works |

---

## 4. Shared data access

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 4.1 | Children visible | Member opens app after join | Owner’s children listed |
| 4.2 | Edit event | Member edits shared event | Saves; owner sees change |
| 4.3 | Owner email still works | Member joined; owner runs sync/forward | Processing still attributes to owner |
| 4.4 | Member email blocked | Member calls sync/forward/inbound APIs | 403 `FAMILY_MEMBER_EMAIL_SYNC_NOT_ALLOWED` |
| 4.5 | Member calendar | Member connects calendar on User Profile | OAuth succeeds; conflict check can run (Premium+) |

---

## 5. Leave and revoke

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 5.1 | Member leave | Member → Leave family → confirm | Loses children/events; account remains |
| 5.2 | Owner revoke | Owner removes member | Member loses access immediately |
| 5.3 | Cancel pending | Owner cancels pending invite | Invite email link invalid |

---

## 6. Subscription (family billing)

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 6.1 | Member read-only | Member → Subscription | Owner’s plan shown; banner; no paywall/restore |
| 6.2 | Owner-only prompt | Member taps upgrade / ask owner | Alert with owner name/email |
| 6.3 | Member sync API | Member `POST /users/me/subscription/sync` | 403 `FAMILY_MEMBER_CANNOT_MANAGE_SUBSCRIPTION` |
| 6.4 | Quotas | Member at child/email cap | Upgrade prompt asks owner (not IAP) |
| 6.5 | Owner downgrade block | DIAMOND owner with 2 active members → downgrade to PREMIUM in store | Backend blocks sync if >1 member allowed; or remove member first |
| 6.6 | Downgrade propagates | Owner downgrades legally | Members see lower limits on next subscription fetch |

---

## 7. Owner delete (dissolve)

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 7.1 | Warning copy | Owner → Settings → Delete account | Family dissolve warning shown |
| 7.2 | Dissolve | Owner deletes account | Members: `family_group_id`/`family_role` cleared; no shared children |
| 7.3 | Member account | After dissolve, member signs in | Solo account; no orphan family_role |

---

## 8. Owner join notification

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 8.0 | Push + in-app | Member accepts invite; owner has app installed with push token | Owner receives push; Notifications list shows “Family member joined”; tap opens Child Profile (Family Group) |

---

## 9. Edge cases

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 9.1 | Other family | Email active in family X; invite to family Y | 409 unless left first |
| 9.2 | Owner with solo children | User with own children tries join as member | **Phase 8:** join path wizard (§10); no 409 solely for having children |
| 9.3 | Resend invite | Owner resends pending | New email; token still valid or refreshed per impl |
| 9.4 | Invite existing profiles | Owner invites user who already has child profiles | **Phase 8:** invite succeeds; no owner warning |

---

## 10. Phase 8 — Join paths & notifications (shipped)

**Reference:** [Family_Group_Invite_Implementation_Plan.md](Family_Group_Invite_Implementation_Plan.md) §14–§15.

**QA run (2026-05-18):** Code audit + build verification (`nest build`, `tsc --noEmit`). No automated family e2e tests in repo; **manual staging** still required for rows marked **Manual**.

**Legend:** **Code** = verified in source; **Manual** = run on staging with two accounts + push tokens.

### 10.1 Invite (owner)

| # | Test | Code | Manual | Notes |
|---|------|:----:|:------:|-------|
| 10.1.1 | No block on existing profiles | ✓ | ☐ | `createInvite` blocks only other-family **member**, not owner-with-children (`family.service.ts`). |
| 10.1.2 | Other family at accept | ✓ | ☐ | `completeMemberJoin` → 409 if active member elsewhere; same message on invite. |

### 10.2 Option 1 — Join on group owner’s plan

| # | Test | Code | Manual | Notes |
|---|------|:----:|:------:|-------|
| 10.2.1 | Delete all then join | ✓ | ☐ | `owner_plan` → `deleteAllChildProfilesForUser`; web + app confirmations. |
| 10.2.2 | No profiles | ✓ | ☐ | `applyJoinPathBeforeMemberJoin` returns early when `profiles.length === 0`; no path UI (`family-join.tsx`, web wizard). |

### 10.3 Option 2 — Bring child profiles into family group

| # | Test | Code | Manual | Notes |
|---|------|:----:|:------:|-------|
| 10.3.1 | Enough Child Seats | ✓ | ☐ | Auto-select all when `profiles.length ≤ available`; re-home to owner + `family_group_id`. |
| 10.3.2 | Pick profiles | ✓ | ☐ | Merge UI when over cap; validates `merge_child_ids` ⊆ owned and ≤ `child_seats.available`. |
| 10.3.3 | Grandfather whitelist | ✓ | ☐ | Merge does not trim institutions; whitelist enforced on **save** via quota service (not at join). |
| 10.3.4 | Edit after join | ✓ | ☐ | `FamilyAccessService.canAccessChild` by `family_group_id`; member uses `childrenApi` with own `user.id`. |

### 10.4 Notifications

| # | Test | Code | Manual | Notes |
|---|------|:----:|:------:|-------|
| 10.4.1 | Shared inbox | ✓ | ☐ | `resolveNotificationUserId` → owner bucket for all members. |
| 10.4.2 | Push fan-out | ✓ | ☐ | `NotificationsService.create` → `listNotificationRecipientUserIds` + same `notificationId` in push payload. |
| 10.4.3 | Shared read | ✓ | ☐ | `updateStatus` / `bulkMarkRead` update owner bucket row. |
| 10.4.4 | Join notify | ✓ | ☐ | `notifyFamilyMemberJoined`; push **owner only** (`fanOutPush: false`); body includes merged names when applicable. |

### 10.5 Rules

| # | Test | Code | Manual | Notes |
|---|------|:----:|:------:|-------|
| 10.5.1 | No path switch | ✓ | — | `join_path` not persisted; no API to change after join. |
| 10.5.2 | Owner path hidden | ✓ | — | No `join_path` in family member DTO / `FamilyGroupSection` UI. |

### 10.6 Manual staging script (recommended)

1. **Setup:** Owner A (PREMIUM, 1 member slot, 1 child seat used → 0 available OR DIAMOND with spare seats). Invitee B with 2 child profiles (different institutions).
2. **10.1.1:** A invites B → email received; no owner-side error.
3. **10.3.2:** B accepts in app → merge path → select 1 profile → confirm → verify 1 child under family, 1 deleted.
4. **10.2.1:** Reset B (new invite) → owner plan → confirm delete → B has 0 own children; sees A’s children.
5. **10.4.2:** Owner syncs email → grey-area notification → both devices get push; both see same row in Notifications.
6. **10.4.4:** New member join → owner push + in-app “joined” row; tap opens Profile (not deep-linked to Family Group section).

---

## Sign-off

| Area | Tester | Date | Pass |
|------|--------|------|------|
| Invite limits / domains | | | |
| Web join | | | |
| In-app accept | | | |
| Shared data | | | |
| Leave / revoke | | | |
| Subscription | | | |
| Owner delete | | | |
| **Phase 8 — Join paths & notifications** | Code audit 2026-05-18 | 2026-05-18 | Code ✓; manual ☐ |
