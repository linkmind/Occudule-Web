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
| **Google** | OAuth 2.0 | Automatically qualifies as a Gmail account for email syncing |
| **Microsoft** | OAuth 2.0 | Automatically qualifies as an Microsoft email account for email syncing |
| **Apple ID** | Sign in with Apple | Required for iOS App Store compliance |

### 2.1 Behaviour on First Social Login (Registration)

- If the social account **does not exist** in the system → create a new account automatically.
- Pre-populate the user's **first name, last name, and email** from the social provider's profile data (where permitted).
- Redirect the user to complete their **Profile setup** (preferred name, child information, etc.).

### 2.2 Behaviour on Subsequent Social Login

- If the social account **already exists** in the system → log the user in directly.
- Redirect to the **Home screen**.

### 2.3 Email Syncing Eligibility from Social Login

| Social Provider | Email Sync Eligible | Auto-populate Email Sync Field? |
|---|---|---|
| Google | ✅ Yes (Gmail) | ✅ Yes |
| Microsoft | ✅ Yes (Outlook) | ✅ Yes |
| Apple ID | ❌ No (Apple private relay email not supported) | ❌ No — leave blank, prompt user to add a Gmail or Microsoft email address in Profile settings |

---

## 3. Shared Validation Rules

| Scenario | Behaviour |
|---|---|
| Email domain not Gmail or Microsoft email accounts (email registration) | Show error: *"Only Gmail and Microsoft email accounts are supported. Please register with one of these accounts."* |
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
