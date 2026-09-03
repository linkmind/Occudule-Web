# Registration & Login Screen Specification

## Overview

The app supports two methods for account registration and login:

1. [Email & Password](#1-email--password)
2. [Social Login](#2-social-login)
3. [Shared Validation Rules](#3-shared-validation-rules)
4. [Screen Flow](#4-screen-flow)
5. [UI/UX Notes](#5-uiux-notes)

---

## 1. Email & Password

### 1.1 Registration

- Users can register using an **email address and password**.
- Upon submission, the app runs a **validation check** on the email domain.
- **Only Gmail and Microsoft email accounts are accepted.**
- If the email does not belong to Gmail or Microsoft email accounts, display the following error message:

  > *"Only Gmail and Microsoft email accounts are supported. Please register with one of these accounts."*

#### Registration Form Fields

| Field | Type | Validation |
|---|---|---|
| Email Address | Text input (email keyboard) | Required. Must be a `@gmail.com` or `@outlook.com` / `@hotmail.com` / `@live.com` / `@live.ca` / `@hotmail.co.uk` domain |
| Password | Secure text input | Required. See password rules below |
| Confirm Password | Secure text input | Required. Must match Password field |

#### Email verification (account ownership)

After successful registration:

1. The API sends a **confirmation email** (Postmark) with a link to `{API}/verify-email?token=...`.
2. The app shows a **Confirm your email** screen (no JWT until verified).
3. The user opens the link, confirms on the web page, then **logs in** with email and password.
4. **Resend confirmation** is available from the pending screen and from login when the account is unverified.

OAuth sign-in (Google, Microsoft, Apple) does **not** require this step.

#### Password Requirements (Recommended Best Practice)

| Rule | Requirement |
|---|---|
| Minimum length | 8 characters |
| Uppercase letter | At least 1 |
| Lowercase letter | At least 1 |
| Number | At least 1 |
| Special character | At least 1 (e.g., `!@#$%^&*`) |

> Display password strength indicator and inline validation feedback as the user types.

### 1.2 Login

- Users who registered via email log in with their **email address and password**.
- If the account exists but **email is not verified**, show an error and offer **Resend confirmation email** (no JWT issued).
- Display a **"Forgot Password?"** link below the password field.

#### Forgot Password Flow

1. User taps "Forgot Password?"
2. User enters their registered email address.
3. App sends a **password reset email** (only if the email exists in the system — do not confirm or deny whether an account exists for security best practice).
4. Display message: *"If an account exists for this email, a password reset link has been sent."*
5. User taps the link in the email → directed to a reset password screen within the app.
6. User enters and confirms a new password → redirected to the login screen.

---

## 2. Social Login

Users can register or log in using any of the following social accounts. No email/password entry is required.

| Provider | Protocol | Notes |
|---|---|---|
| **Google** | OAuth 2.0 | Must be a Gmail address on the registration allowlist. Automatically qualifies as a Gmail account for email syncing. |
| **Microsoft** | OAuth 2.0 | Must be a Microsoft address on the registration allowlist. Automatically qualifies as a Microsoft email account for email syncing. |
| **Apple ID** | Sign in with Apple | Required for iOS App Store compliance. **Any email Apple returns may create an Occudule account** (Gmail, Microsoft, iCloud, Hide My Email / private relay, work domains, and others). Sign in with Apple is **identity only** — it does not grant Gmail or Outlook API access. |

### 2.1 Behaviour on First Social Login (Registration)

- If the social account **does not exist** in the system → create a new account automatically.
- Pre-populate the user's **first name, last name, and email** from the social provider's profile data (where permitted).
- **Google and Microsoft:** still reject emails that are not on the Gmail / Microsoft allowlist (same message as email/password registration).
- **Apple:** do **not** apply that allowlist. If Apple provides a verified email, create the account even when the domain is not Gmail or Microsoft. Store `users.email_host` as `GMAIL` / `OUTLOOK` when the Apple email is on the allowlist; otherwise store `email_host` as `NULL`.
- Redirect the user to complete their **Profile setup** (preferred name, child information, etc.).

### 2.2 Behaviour on Subsequent Social Login

- If the social account **already exists** in the system → log the user in directly.
- Redirect to the **Home screen**.
- Returning Apple users whose login email is not Gmail or Microsoft can only sign in with Apple (email/password registration remains Gmail/Microsoft-only).

### 2.3 Email Syncing Eligibility from Social Login

Mail sync still requires a **Gmail or Microsoft mailbox** connected on User Profile. Social login email is the **account** address, not automatically a connected mailbox.

| Social Provider | Can create an Occudule account | Auto-populate Email Sync Field? |
|---|---|---|
| Google | ✅ Yes (allowlisted Gmail only) | ✅ Yes — copy the Google email into `sync_email` |
| Microsoft | ✅ Yes (allowlisted Microsoft only) | ✅ Yes — copy the Microsoft email into `sync_email` |
| Apple ID, and the Apple email **is** Gmail or Microsoft | ✅ Yes | ✅ Yes — copy that address into `sync_email`. User still taps **here** on User Profile to complete Google or Microsoft OAuth (Apple tokens cannot sync mail). |
| Apple ID, and the Apple email **is not** Gmail or Microsoft (iCloud, Hide My Email / `@privaterelay.appleid.com`, Yahoo, work domains, etc.) | ✅ Yes | ❌ No — leave `sync_email` **blank**. Do not copy Hide My Email or other unsupported addresses into the sync field. |

User Profile copy and connect behaviour for the blank Apple case: [profile_screen_spec.md §1.3](profile_screen_spec.md#13-email-account-for-account-syncing).

**Unchanged restrictions:** email/password registration, Google/Microsoft social login, and **family member invites** stay Gmail/Microsoft-only. An Apple user whose account email is iCloud or Hide My Email may be a **family owner**, but that address cannot be used as an invitee email.

### 2.4 Sign in with Apple — implementation (as shipped)

- **Platform:** iOS only. The native button uses `expo-apple-authentication`. On Android the app explains that Apple sign-in is iOS-only.
- **API:** `POST /auth/apple/mobile` with `identity_token` (required). Optional `email`, `given_name`, and `family_name` — Apple often returns name and email only on the **first** authorization for the app.
- **Verification:** The backend verifies the identity-token JWT against Apple’s JWKS (`iss` = `https://appleid.apple.com`; `aud` must match `APPLE_CLIENT_ID` / `APPLE_CLIENT_IDS`, typically the iOS bundle ID such as `com.occudule.app`).
- **Email required:** If the token has no email, the API tells the user to remove the app under iOS **Settings → Apple ID → Sign in with Apple** and try again.
- **Verified email:** Apple must mark the address `email_verified`. Hide My Email (`@privaterelay.appleid.com`) still counts as verified.
- **Allowlist:** Not applied for Apple **account creation**. `users.email_host` is `GMAIL` / `OUTLOOK` when the Apple email is on the Gmail/Microsoft allowlist; otherwise `NULL`. `sync_email` is prefilled only when `email_host` is set.

---

## 3. Shared Validation Rules

| Scenario | Behaviour |
|---|---|
| Email domain not Gmail or Microsoft email accounts (email/password registration, Google sign-in, or Microsoft sign-in) | Show error: *"Only Gmail and Microsoft email accounts are supported. Please register with one of these accounts."* |
| Apple sign-in email is not Gmail or Microsoft | **Allow** account creation. Do not show the registration domain error. Leave the User Profile sync-email field blank and remind them there (see §2.3). |
| Email already registered | Show error: *"An account with this email already exists. Please log in or use a different email."* |
| Incorrect password on login | Show error: *"Incorrect email or password."* (do not specify which field is wrong — security best practice) |
| Too many failed login attempts | Temporarily lock account or show CAPTCHA after 5 consecutive failed attempts |
| Empty required field | Inline field-level error: *"This field is required."* |
| Password mismatch (registration) | Inline error on Confirm Password: *"Passwords do not match."* |

---

## 4. Screen Flow

```
┌─────────────────────────────┐
│        Welcome Screen        │
│                              │
│  [Create Account]  [Log In]  │
└────────────┬────────────────┘
             │
    ┌────────┴─────────┐
    ▼                  ▼
Register Screen     Login Screen
    │                  │
    ├── Email/Password  ├── Email/Password
    └── Social (G/M/A) └── Social (G/M/A)
             │                  │
             ▼                  ▼
      Profile Setup ──────► Home Screen
      (new users only)
```

---

## 5. UI/UX Notes

- **"Log In" and "Create Account"** should be clearly presented on a Welcome/Splash screen before any form is shown.
- Social login buttons must follow each provider's **official branding guidelines**:
  - Google: ["Sign in with Google" button](https://developers.google.com/identity/branding-guidelines)
  - Microsoft: ["Sign in with Microsoft" button](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-branding-in-apps)
  - Apple: ["Sign in with Apple" button](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple) — **required on iOS if any other social login is offered**
- Social login buttons should appear **above** the email/password form, separated by an **"or"** divider.
- Passwords must never be stored in plain text — use **bcrypt** or equivalent hashing.
- All auth flows should support **secure token storage** (Keychain on iOS, Keystore on Android).
- The registration and login screens should be **accessible** (VoiceOver / TalkBack compatible, sufficient colour contrast).

### Suggested Layout

```
┌──────────────────────────────┐
│         [App Logo]           │
│                              │
│  [G]  Sign in with Google    │
│  [M]  Sign in with Microsoft │
│  [A]  Sign in with Apple     │
│                              │
│  ─────────── or ───────────  │
│                              │
│  Email ____________________  │
│  Password __________________  │
│                 Forgot Password? │
│                              │
│       [Log In / Register]    │
│                              │
│  Don't have an account?      │
│  [Create Account] / [Log In] │
└──────────────────────────────┘
```
