# About This App Screen Specification

## Overview

The **About This App** screen is accessible from the main dropdown menu (top-right of the home screen). It serves three purposes:

1. Inform users about the app's features and purpose
2. Meet App Store (Apple) and Google Play Store compliance requirements
3. Build user trust through transparency and easy access to support

---

## Sections

1. [App Introduction](#1-app-introduction)
2. [Key Features](#2-key-features)
3. [Version & Build Info](#3-version--build-info)
4. [Legal](#4-legal)
5. [Third-Party Licenses](#5-third-party-licenses)
6. [Support & Feedback](#6-support--feedback)

---

## 1. App Introduction

Display a brief, friendly description of the app's purpose. Example copy:

> This app helps busy families stay organized by automatically syncing emails and calendars, detecting scheduling conflicts, and keeping all of your children's school and activity information in one place — powered by AI.

- Copy should be concise (2–4 sentences).
- Tone: warm, trustworthy, family-oriented.

---

## 2. Key Features

Highlight the app's core capabilities. Display as a scannable list:

| Feature | Description |
|---|---|
| Email Syncing | Connects with Gmail and Outlook to automatically detect relevant emails for each child |
| Calendar Sync | Syncs events and activities to your calendar, keeping the whole family on schedule |
| Conflict Detection | Detects scheduling conflicts up to 60 days in advance and alerts you in real time |
| Multi-Child Support | Manage up to 6 children, each with their own schools and education institutions |
| Smart Notifications | Push notifications for event reminders, conflict alerts, and action-required items |
| Multi-Language Support | Available in English, French, Simplified Chinese, Traditional Chinese, Spanish, and more |
| AI-Powered | Uses AI to identify relevant emails and surface the information that matters most |

---

## 3. Version & Build Info

Display the following in a simple, readable layout:

| Field | Value |
|---|---|
| Version | `1.0.0` *(dynamically populated from app build)* |
| Build Number | `100` *(dynamically populated)* |
| Platform | iOS / Android *(shown based on device)* |

> **Implementation Note:** Version and build number should be read programmatically from the app's build configuration (e.g., `CFBundleShortVersionString` on iOS, `versionName` on Android) so they update automatically with each release — never hardcoded.

---

## 4. Legal

> **Compliance Note:** Both Apple App Store and Google Play Store require accessible links to Terms of Service and Privacy Policy.

### 4.1 Terms of Service

- Label: **Terms of Service**
- Display as a tappable link.
- *(Placeholder — URL to be added before launch)*

### 4.2 Privacy Policy

- Label: **Privacy Policy**
- Display as a tappable link.
- *(Placeholder — URL to be added before launch)*
- Must comply with GDPR, CCPA, and Apple/Google privacy requirements given the app collects email, calendar, and children's information.

### 4.3 Suggested Layout

```
Terms of Service        >
Privacy Policy          >
```

---

## 5. Third-Party Licenses

A standard acknowledgment section for open-source libraries and SDKs used in the app.

- Label: **Third-Party Licenses** or **Open Source Acknowledgements**
- Tapping it should navigate to a scrollable sub-screen listing all libraries and their licenses.
- This is required for many open-source licenses (MIT, Apache 2.0, etc.) and expected by app store reviewers.

### 5.1 Sub-screen Format

Each entry should display:

| Field | Example |
|---|---|
| Library Name | `Alamofire` |
| Version | `5.8.1` |
| License Type | MIT License |
| License Text | Full license text (expandable or scrollable) |

> **Implementation Note:** Consider using an automated tool (e.g., `license-checker` for Node.js, or `LicensePlist` for iOS) to generate this list during the build process.

---

## 6. Support & Feedback

### 6.1 Rate the App

- Label: **Rate Us on the App Store** / **Rate Us on Google Play**
- Tapping opens the app's store listing in the native App Store or Google Play app.
- Display platform-appropriate label based on device OS.
- Recommended placement: prominent, with a ⭐ icon.

### 6.2 Send Feedback / Feature Request

- Label: **Send Feedback** or **Request a Feature**
- Tapping opens the device's default email client with a pre-filled email:
  - **To:** `support@[yourdomain].com` *(placeholder — to be confirmed)*
  - **Subject:** `[App Name] Feedback – v1.0.0` *(version dynamically inserted)*
  - **Body:** *(leave blank for user to fill in)*
- This approach is lightweight and effective for early-stage apps.

### 6.3 Suggested Layout

```
⭐  Rate This App             >
✉️  Send Feedback             >
```

---

## UI/UX Notes

- The About screen should use a **grouped list layout** (similar to iOS Settings style) with clear section headers.
- Legal and support links should use a **chevron `>`** to indicate they are tappable.
- Version number should appear at the **bottom of the screen**, centered, in a small muted font — this is the standard convention on both iOS and Android.
- All external links (Terms, Privacy Policy, App Store) should open in the appropriate in-app browser or native app — not replace the current screen.
- Keep the screen **lightweight and fast-loading** — no network calls required except for tappable link navigation.

---

## Screen Layout (Suggested Order)

```
[ App Icon + Name + Tagline ]

──── ABOUT ────────────────────
  App Introduction (2–4 lines)
  Key Features  >

──── INFO ─────────────────────
  Version 1.0.0 (Build 100)

──── LEGAL ────────────────────
  Terms of Service  >
  Privacy Policy  >
  Third-Party Licenses  >

──── SUPPORT ──────────────────
  ⭐ Rate This App  >
  ✉️ Send Feedback  >

[ Version 1.0.0 • Build 100 ]  ← footer, muted
```
