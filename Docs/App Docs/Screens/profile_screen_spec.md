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

- **Email Address:** The email used to sign up or sign in to the app.
- **Connection Status:** `Connected` / `Disconnected`

#### Connection Status Logic

| Scenario | Connection Status | Message Shown |
|---|---|---|
| Gmail or Microsoft email account — connection test passed | `Connected` | *(none)* |
| Gmail or Microsoft email account — connection test failed | `Disconnected` | *"Please check with your email provider. Syncing has failed."* |
| Neither Gmail nor Microsoft email account | `Not Supported` | *"This app supports syncing with Gmail and Microsoft email accounts only. Please add a Gmail or Microsoft email account to get started."* |

### 1.3 Email Account (for Account Syncing)

- Automatically populated with the User Account email if it is a Gmail or Microsoft email account.
- If the User Account is neither Gmail nor Microsoft email accounts, this field is left **empty**.
- After the user manually enters an email address, the app runs a **validation check**:
  - Only Gmail and Microsoft email accounts are accepted.
- This email account is used for **email syncing**.

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
- Connection Status should update dynamically after the email validation check runs.
- Extend or modify content as needed based on project requirements and evolving product needs.
