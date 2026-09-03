# Profile Screen Specification

## Overview

The product uses **two profile-related screens** in the mobile app:

| Screen | Route | Purpose |
|--------|--------|---------|
| **Family Profile** | `profile.tsx` (`/profile`, `/child-profile`) | Child profiles, schools/institutions, **Family Group** |
| **User Profile** | `user-profile.tsx` | Account name, email sync, calendar OAuth, forward address |

When the user opens **Profile** from the home dropdown, they land on **Family Profile** first during onboarding; **User Profile** is reachable from onboarding prompts or navigation after setup.

**Family Profile** sections (in order):

1. [Child Information](#2-child-information)
2. [Family Group](#3-family-group)

**User Profile** covers account and integration fields described in [§1 User Profile](#1-user-profile). Family **members** have a reduced User Profile (no email sync / forward; calendar connect only). See [Family Group](#3-family-group) and [App Features/Family_Group_Invite_Implementation_Plan.md](../App%20Features/Family_Group_Invite_Implementation_Plan.md).

---

## 1. User Profile

### 1.1 User Information

| Field | Description |
|---|---|
| First Name | User's first name |
| Last Name | User's last name |
| Preferred Name | User's preferred display name |

### 1.2 User Account

- **Email Address:** Read-only. The email used to sign up or sign in (email/password, Google, Microsoft, or Apple).
- This is the **login identity**, not the mailbox used for school-mail sync. For Apple it may be Gmail, Microsoft, iCloud, Hide My Email (`@privaterelay.appleid.com`), or another address Apple returns.

Email syncing status lives under **Email Account (for syncing)** (§1.3), not on this login field.

### 1.3 Email Account (for Account Syncing)

Field label: **Email Account (for syncing)**. Placeholder: **Gmail or Microsoft email**.

This field is `users.sync_email`. It is the mailbox Occudule connects (Gmail/Outlook OAuth, forwarding, calendar). **Connection / “Tap here” logic follows this field, not the login email in §1.2.**

#### Prefill

- Automatically populated with the User Account email **only if** that address is a Gmail or Microsoft email on the allowlist (Google sign-in, Microsoft sign-in, email/password, or Apple when the Apple email is Gmail/Microsoft).
- If the User Account email is **not** Gmail or Microsoft (typical: Apple iCloud, Hide My Email, Yahoo, work domain), leave this field **empty**. Never copy a private-relay or other unsupported address into `sync_email`.
- After a successful Google or Microsoft **mailbox** OAuth connect, **do not** overwrite `sync_email`. Save the box before opening OAuth. The connected account must match the address in this box (Microsoft **aliases** on the same account still count). If the user signs in with a **different** Microsoft/Google account, show an error and keep the box unchanged.
- **Microsoft mailbox connect** (User Profile “Tap here”): treat this as linking a Microsoft **account**, not a specific alias. Authorize with `prompt=select_account` and **do not** send `login_hint` (a leftover Outlook session in the in-app browser otherwise ignores the hint and stays on the wrong account). The picker lists Microsoft accounts already in that browser; Hotmail and Outlook that share one Microsoft account still appear as **one** row. If SSO still skips the picker, use `prompt=select_account login` (`prompt=login`).
- **Google mailbox connect:** keep the existing Google authorize behaviour (`prompt=consent`, optional `login_hint`). Google already shows an account chooser.

#### Empty box (unsupported Apple login)

When the box is empty because the login email cannot be used for sync:

- Show a **helper directly under the input** (always visible until they enter a supported address), for example:  
  *“Enter a Gmail or Microsoft email here to sync school mail. Your Apple sign-in address cannot be used for syncing.”*
- **Email syncing** status: `Disconnected`.
- Do **not** show **Tap here to connect** (nothing to connect yet).
- Do **not** show `Not Supported` for the Apple login identity — that would make the whole feature look unavailable.
- Calendar integration: `Not connected`.
- Do **not** use an alert as the first reminder (easy to miss; do not alert on every field blur). The helper under the box is the teaching copy.

#### After the user types an address

- **Supported Gmail or Microsoft:** hide the Apple helper. Email syncing becomes `Not connected yet`. Show: *Tap **here** to connect and start syncing.* Tapping starts Google or Microsoft OAuth (same as today). Apple tokens are never used for mail sync.
- **Unsupported address** (iCloud, Hide My Email, Yahoo, etc.): keep the field, show the inline error *“Only Gmail and Microsoft email accounts are accepted.”* Do not start OAuth. Email syncing may show `Not Supported` **only** because the address **in this box** cannot be synced.
- **Empty or unsupported, and they tap “here” anyway:** show an alert that only Gmail and Microsoft emails are supported (backup, not the primary empty-state reminder).

#### Email syncing status (driven by the sync field)

| Scenario | Email syncing status | Under the status row |
|---|---|---|
| Sync field empty | `Disconnected` | *(none — helper sits under the input when login email is not Gmail/Microsoft)* |
| Sync field is Gmail or Microsoft — not yet OAuth-connected | `Not connected yet` | *Tap **here** to connect and start syncing.* |
| Sync field is Gmail or Microsoft — OAuth connected / connection test passed | `Connected` | *(none)* |
| Sync field is Gmail or Microsoft — connection test failed | `Disconnected` | *"Please check with your email provider. Syncing has failed."* |
| Sync field has a value that is neither Gmail nor Microsoft | `Not Supported` | Inline error on the field (and optional status copy). Do not start OAuth. |

#### Family member restrictions (User Profile)

When `family_role === 'member'`:

| Area | Owner | Member |
|------|:-----:|:------:|
| Email sync / forward / inbound address UI | Shown | **Hidden** |
| Calendar OAuth (Google / Microsoft) | Shown | **Shown** (for conflicts + event mirroring) |

Members use the **family owner’s** subscription for quotas and see a read-only plan on the Subscription screen.

---

## 2. Child Information

> **Note:** Each child has their own unique list of Schools and Other Education Institutions.

## Child profile selection & editing

- After saving a child profile, the name appears in a **dropdown** here.
- The user can select a child profile to view and edit **Child fields**, **School**, and **Other education institutions**.
- Changes are saved per child profile (**Save**).
- **Delete child profile:** **×** on each row in the dropdown (with confirmation). Removes the profile and related data per backend rules.

## Adding Children

- A **`+`** button allows users to add information for their child.
- Maximum of **4 children** supported.

### 2.1 Child Fields
- The child fields and  will show up after the user clicks the '+' sign to add information. 

| Field | Description |
|---|---|
| First Name | Child's first name |
| Last Name | Child's last name |
| Preferred Name | Child's preferred display name |
| Nickname | Child's nickname |
| Image Upload | Optional. Displayed on the home screen. |
| Grade | Child's current grade which will be used as one of the keywords to detect incoming emails. |
| Grade Start Date | Notifying the user of updating the Grade informaiton by push notification in which there will be a link to this setting 7 days before the start date here |.

### 2.2 School

Child can only have one schools.

| Field | Description |
|---|---|
| School Name | Name of the school |
| Email Domain | Placeholder: `@school.edu` |
| Email Address | One or more email addresses (use **`+`** to add more) |
| Keywords | Keywords to help the AI identify relevant emails (e.g., *soccer training*, *after school program*). Used in combination with embedded prompt keywords. |

### 2.3 Other Education Institutions

Each child can have one or more other education institutions, but 6 institution accounts per child at maximum (e.g., clubs, tutoring centers).
the same as Adding child section, please display a '+' sign for users to start adding Other Education Institutions. If the user doesn't click the '+' sign, then this section show an empty message: "No education institution has been added. Please click ‘+’ to add one.".

| Field | Description |
|---|---|
| Institution Name | Name of the institution |
| Email Domain | Placeholder: `@clubname.edu` |
| Email Address | One or more email addresses (use **`+`** to add more) |
| Keywords | Keywords to help the AI identify relevant emails (e.g., *instructor's name*, *robotics meetup*). Used in combination with embedded prompt keywords. |

---

## 3. Family Group

**Location:** Family Profile (`profile.tsx`), **below** the Child Information block (child profile dropdown, fields, schools, institutions).

**Component:** `FamilyGroupSection` — data from `GET /family`.

### 3.1 Purpose

Lets the **family owner** invite another adult (spouse/co-parent) to share the same household data: children, events, to-dos, and notifications. Invited users join via **email link → web wizard** or **in-app accept** (`family-join` screen / `occudule://family/join?token=`).

### 3.2 Roles

| Role | Who | UI |
|------|-----|-----|
| **Owner** | Account that created the family | Invite, resend/cancel pending, remove members |
| **Member** | Accepted invitee | View owner line + co-members; **Leave family** |

### 3.3 Owner UI

- Intro copy: shared children/events; only owner processes school email; members may connect calendar.
- **Active members** list (name, email, optional relationship label) with **Remove**.
- **Pending invitations** (email, relationship, expiry) with **Resend** and **Cancel**.
- **Invite family member** button → modal: email (Gmail/Microsoft only), optional relationship.
- **Plan gating:**
  - **FREE:** button shows upgrade CTA; invite disabled (API 403).
  - **PREMIUM:** max **1** active + pending member (excluding owner).
  - **DIAMOND:** max **3** active + pending members.
- At capacity: hint showing used/max slots.

### 3.4 Member UI

- Line: *“You are in {Owner name}'s family group.”*
- **Leave family** → confirm → `POST /family/leave` (clears membership; account remains).

### 3.5 Invite flow (summary)

1. Group owner sends invite → Postmark email (`{Name} invited you to the family group on Occudule`) with `https://{API}/family/join?token=...` (7-day expiry).
2. Invitee: web password/sign-in **or** app deep link + `POST /family/join/accept-app` when signed in.
3. **No** owner warning if invitee already has child profiles. Invitee **cannot accept** if already in another family group.
4. **Existing invitee with child profiles (Phase 8):** choose **Join on the group owner’s plan** (delete all profiles first) or **Bring child profiles into the family group** (merge within **Child Seats**). One-time choice. Details: [Family_Group_Invite_Implementation_Plan.md](../App%20Features/Family_Group_Invite_Implementation_Plan.md) §14.
5. On accept: `family_role = member`, shared `family_group_id`; **email sync disabled** (OAuth mail removed; calendar reconnect in User Profile). Members may edit **child profiles** in the family group.

### 3.6 Notifications (family activity)

- **In-app:** Shared inbox (group owner notification bucket) — owner and members see the same list; confirm event/info or open entity as today.
- **Push:** Each member (and owner) receives their own system notification; tap opens the shared in-app notification.
- See implementation plan §15.

### 3.7 Owner deletes account

Deleting the owner account **dissolves** the family: members lose access to shared data; children/events under the owner are removed. Settings shows an extra warning for owners. See implementation plan §6.7.

---

## UI/UX Notes

- **Family Profile** is the primary **Profile** entry from the home dropdown; **User Profile** is a separate screen for account and integrations.
- All form fields should include appropriate validation (required vs. optional clearly indicated).
- Email domain fields use placeholder text to guide input format.
- The **`+`** controls for email addresses, children, and Other Education Institutions should be clearly accessible and intuitive.
- Connection / email-syncing status should follow the **sync email** field and update after validation or OAuth, not the Apple/Google/Microsoft **login** email.
- When Apple login is not a Gmail or Microsoft address, the empty sync field must show the helper under the box (see §1.3); do not leave the row looking like the account cannot use email sync at all.
- Extend or modify content as needed based on project requirements and evolving product needs.
