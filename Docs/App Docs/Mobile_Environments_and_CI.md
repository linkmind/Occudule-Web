# Mobile environments & CI/CD — Phase A (decisions)

This document locks **Phase A** for Occudule: two store apps (staging + production) from **one repo** (`mobile/`), with GitHub Actions driving EAS builds in **Phase E**. **Phase D** (`app.config.js`, `eas.json` **`staging`** profile, OAuth scheme helper) is implemented in the repo.

---

## 1. Locked decisions (Phase A)

| Item | Production | Staging |
|------|------------|---------|
| **User-facing app name** | Occudule | Occudule Staging |
| **iOS bundle identifier** | `com.occudule.app` | `com.occudule.app.staging` |
| **Android application ID** | `com.occudule.app` | `com.occudule.app.staging` |
| **Deep link / URL scheme** | `occudule` | `occudule-staging` |
| **API base (`EXPO_PUBLIC_API_URL`)** | `https://api.occudule.com` | `https://api-staging.occudule.com` |

**Expo strategy (locked)**

- **One Expo project** on expo.dev (single `extra.eas.projectId` in the app config).
- **One slug:** `occudule` for all environments. Staging vs production is distinguished by **bundle ID / Android applicationId / scheme / display name** per EAS build profile (Phase D: `app.config.js`), not by a second slug or second Expo project.
- If you adopt **EAS Update** later, use **channels** (e.g. `staging` vs `production`) to separate OTA bundles — still within the same Expo project.

**Git branching (locked)**

| Branch | Purpose |
|--------|---------|
| `main` | Production releases; production EAS builds (and gated submit). |
| `staging` | Integration / pre-production; staging EAS builds for QA (matches environment name). |

Feature branches merge into **`staging`**; **`staging`** merges to **`main`** when you cut a production release.

> **Naming:** Git branch **`staging`** is separate from the EAS build profile **`staging`** (profile = how the binary is built; branch = when CI runs).

**EAS profile mapping (target state after Phase D)**

| Profile | Client type | Bundle / package | Typical API |
|---------|-------------|------------------|-------------|
| `development` | Dev client | Same as today until Phase D wires profile-specific IDs | Local or staging (team choice) |
| `staging` | Release-style (not Expo Go) | Staging IDs | Staging API |
| `production` | Release-style | Production IDs | Production API |

> **Phase D (implemented):** `mobile/app.config.js` switches **name / scheme / bundle ID / Android package / Firebase plist+json** when `EAS_BUILD_PROFILE=staging`. `mobile/eas.json` defines **`staging`** (staging API + `com.occudule.app.staging`) and **`production`**. Staging builds **fail fast** until both `GoogleService-Info-Staging.plist` and `google-services-staging.json` exist under `mobile/`. The old **`preview`** profile was removed — use **`staging`** instead.

---

## 2. What you should do on your end (after Phase A)

### Confirm or adjust URLs and names

1. **Staging API** — **Done on your side.** Keep this doc’s **`EXPO_PUBLIC_API_URL`** staging value in sync with the URL you actually deployed (table above, or your real host if it differs from `https://api-staging.occudule.com`).
2. **Expo** — Keep **one** project on expo.dev; slug stays **`occudule`**. No second Expo app is required for staging.

### Git

3. Use branch **`staging`** (created) as the merge target for feature work and as the trigger for staging CI builds once workflows exist.
4. In GitHub: enable **branch protection** on `main` (PR required, optional required checks). Optionally protect **`staging`** too.

### Apple (Phase B — next)

5. **Certificates, Identifiers & Profiles** — Register App ID for **`com.occudule.app.staging`** with the same capability set you need as production (Sign in with Apple, Push, etc., as applicable).
6. **App Store Connect** — Create a **new app** for the staging bundle ID (for TestFlight).
7. **OAuth / SSO** — Register redirect URIs and mobile schemes for **`occudule-staging`** (and backend routes if you use distinct callback URLs per environment).

### Google / Firebase (Phase C)

8. Add **staging** iOS/Android apps in Firebase (or separate project), then commit **`mobile/GoogleService-Info-Staging.plist`** and **`mobile/google-services-staging.json`** (exact names). Staging EAS builds **fail at config time** if either file is missing.

### Third-party dashboards

9. **RevenueCat, Zoho SalesIQ, etc.** — Create or isolate **staging** API keys / apps; you will attach them to the **staging** EAS environment in Expo (Phase D).

### GitHub Actions (Phase E)

10. Generate **`EXPO_TOKEN`** on expo.dev and add it as a repository secret **`EXPO_TOKEN`**.
11. After workflows exist: confirm the workflow uses **`working-directory: mobile`** (or equivalent) so `eas build` runs in the correct folder.

---

## 3. Revision history

| Date | Change |
|------|--------|
| 2026-05-08 | Phase A decisions documented (two apps, IDs, schemes, API URLs, branching). |
| 2026-05-08 | Expo strategy locked: single Expo project, single slug `occudule`; staging vs prod via bundle IDs and EAS profiles (EAS Update channels noted for later). |
| 2026-05-08 | Git: use branch `staging` (not `develop`); staging API URL setup confirmed by team — keep doc URL aligned with deployed host. |
| 2026-05-08 | Phase D: `app.config.js`, `eas.json` `staging` profile, OAuth scheme via `getAppScheme()`, `preview` removed. |
