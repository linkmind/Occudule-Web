# Microsoft (Entra ID) OAuth — Redirect URIs & Setup

This document lists redirect URIs for Occudule’s Microsoft integration. Register them in **Microsoft Entra ID** (Azure Portal) under your app registration → **Authentication** → **Redirect URIs**, using the correct **platform type** for each URI.

---

## 0. Local development — implementation checklist

Use this when running the API and mobile app **only on your machine** (or device hitting your machine via tunnel).

### 0.1 Entra app registration (summary)

- **Application (client) ID:** `86179573-64da-4b81-ade3-01279f752cd4` (Occudule local/dev registration).
- **Client secret:** create one in **Certificates & secrets** in Entra. Copy it **once** into `backend/.env` as `MICROSOFT_CLIENT_SECRET`. **Do not commit** secrets to git; `backend/.env` is gitignored.
- **Redirect URI (Web):** must match **exactly** what the backend uses for the token exchange:
  - **Pure localhost:** `http://localhost:3000/oauth/microsoft/callback`  
    Set `BACKEND_BASE_URL=http://localhost:3000` in `backend/.env`.
  - **ngrok (e.g. phone testing):** `https://<your-subdomain>.ngrok-free.dev/oauth/microsoft/callback`  
    Set `BACKEND_BASE_URL=https://<your-subdomain>.ngrok-free.dev` (no trailing slash). Register this same URL under **Web** in Entra — **not** `/oauth/google/callback`; use **`/oauth/microsoft/callback`**.
- **Supported account types:** typically “Accounts in any organizational directory and personal Microsoft accounts” if you want consumer Outlook.com.
- **API permissions (delegated):** see §3; grant admin consent if your tenant requires it.

### 0.2 Backend environment (`backend/.env`)

Copy from `backend/.env.example` and set at minimum:

| Variable | Local example |
|---|---|
| `MICROSOFT_CLIENT_ID` | `86179573-64da-4b81-ade3-01279f752cd4` |
| `MICROSOFT_CLIENT_SECRET` | *(paste from Entra only in this file; never commit)* |
| `BACKEND_BASE_URL` | `http://localhost:3000` **or** your ngrok base URL |
| `OAUTH_APP_REDIRECT_SCHEME` | `occudule` in production (must match Expo scheme in `mobile/app.config.js`). Use `occudule-staging` for a staging API that serves the staging mobile build. |
| `MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE` | Random secret (e.g. `openssl rand -hex 32`); required with **HTTPS** `BACKEND_BASE_URL` so Outlook **Inbox push** subscriptions can register (see `Docs/Microsoft_Outlook_Implementation_Checklist.md`) |

Start the API (`npm run start:dev` or your usual command). The mobile app calls `GET /oauth/microsoft/authorize-url` with success/error deep links; the browser completes login and redirects to the backend callback, which then redirects to `{scheme}://oauth/success` or `{scheme}://oauth/error` (e.g. `occudule://` or `occudule-staging://`, matching `OAUTH_APP_REDIRECT_SCHEME`).

### 0.3 Mobile

- `EXPO_PUBLIC_API_URL` in `mobile/.env` must point at the **same** API origin as `BACKEND_BASE_URL` (e.g. `http://<your-LAN-IP>:3000` for a physical device, or ngrok URL).
- Expo scheme is set in `mobile/app.config.js`: **`occudule`** for production/dev-client builds, **`occudule-staging`** for EAS profile **`staging`** (`com.occudule.app.staging`).

### 0.4 Security note

If a client secret was ever pasted into chat or committed to a repo, **rotate it** in Entra (new secret, delete the old one) and update `backend/.env` only.

### 0.5 Step 1 — Connect only (implemented)

**Goal:** User completes Microsoft sign-in; backend stores `user_email_connections` (`provider: microsoft`); **User Profile** shows **Connected** when `outlook_connected` is true and sync email matches a Microsoft domain.

| Layer | Behavior |
|-------|----------|
| Backend | `GET /oauth/microsoft/authorize-url` (JWT) → browser → `GET /oauth/microsoft/callback?code&state` → token exchange → upsert connection → `PATCH` user `sync_email` → redirect `occudule://oauth/success`. Denied consent: `?error&state` → redirect to app `oauth/error` with message. |
| Mobile | **User Profile** (`/user-profile`): enter Microsoft sync email → tap **here** to connect → `getMicrosoftAuthorizeUrl` → `WebBrowser.openAuthSessionAsync`. On return, `loadMe()` refreshes `gmail_connected` / `outlook_connected`. Cold start after OAuth uses `Linking.getInitialURL()`. |

**Manual test:** Set `sync_email` to e.g. `user@outlook.com` → connect → expect **Connected** and `outlook_connected: true` on `GET /users/me`.

---

## 1. Backend redirect (required for current mail-sync OAuth)

The mobile app opens Microsoft sign-in in a browser / `WebBrowser` session. The authorization code is exchanged on the **backend**. Microsoft must allow this redirect URI.

| Environment | Redirect URI | Platform in Azure |
|---|---|---|
| Local dev | `http://localhost:3000/oauth/microsoft/callback` (or your `BACKEND_BASE_URL`) | **Web** |
| Production | `https://<your-api-host>/oauth/microsoft/callback` | **Web** |

- Set `BACKEND_BASE_URL` in the backend `.env` to match the URI you register (no trailing slash in env; the path is fixed in code).
- See also `backend/.env.example` (`MICROSOFT_*`, `BACKEND_BASE_URL`).

---

## 2. Mobile native redirect URIs (MSAL-style)

These are the URIs you configured for **native** Microsoft authentication flows (e.g. MSAL broker / custom scheme). Register them if you use the native Microsoft identity SDK or Entra’s mobile redirect format.

| Platform | Redirect URI |
|---|---|
| **iOS** | `msauth.com.occudule.app://auth` |
| **Android** | `msauth://com.occudule.app/ogELMjrvObEWnacWy3qjq1xgzD8%3D` |

- **iOS**: Matches bundle id style `com.occudule.app` (see `mobile/app.config.js` → `ios.bundleIdentifier`). Staging uses `com.occudule.app.staging`.
- **Android**: Matches `android.package` `com.occudule.app`; the path segment after `msauth://` is generated for the signed app (keep the exact string Azure shows for your keystore).

> **Note:** The current Occudule codebase uses the **backend web callback** in §1 for Outlook mail connection (`/oauth/microsoft/callback`). Native URIs in §2 are for native MSAL-style sign-in if you add or switch to that flow; both can coexist in the same app registration if both flows are used.

### 2.1 Expo — Sign in with Microsoft (account / PKCE)

The mobile app uses **expo-auth-session** with the scheme from **`mobile/app.config.js`**. Register these under **Authentication** → **Mobile and desktop applications** (or **Public client / native**):

| Redirect URI | Notes |
|---|---|
| `occudule://auth/microsoft` | Production and **development** EAS profile (`com.occudule.app`). |
| `occudule-staging://auth/microsoft` | **Staging** EAS profile (`com.occudule.app.staging`). |

For **Expo Go** during development, also add the URI printed in the Metro / Expo logs (often `exp://…`), or run a **development build** (`npx expo run:android` / `run:ios`) so `occudule://` applies.

Use the **same** Entra **Application (client) ID** as `MICROSOFT_CLIENT_ID` in `backend/.env` and `EXPO_PUBLIC_MICROSOFT_CLIENT_ID` in `mobile/.env`.

For **`POST /auth/microsoft/mobile`**, the API exchanges the auth code with **PKCE only** (public client) by default — **no** `client_secret`, which matches Microsoft’s guidance for `occudule://` redirects. In Entra → **Authentication** → **Advanced settings**, set **Allow public client flows** to **Yes** if token exchange fails. If your tenant requires a secret for this flow, set `MICROSOFT_MOBILE_TOKEN_USE_CLIENT_SECRET=true` in `backend/.env` (and keep `MICROSOFT_CLIENT_SECRET` set).

---

## 3. Typical API permissions (delegated)

For Outlook mail read, **default calendar busy/read** (event time conflict vs Outlook), and user profile (align with backend scopes in code):

- `openid`, `profile`, `offline_access`
- `User.Read`
- `Mail.Read`
- `Calendars.ReadWrite` — read the signed-in user’s **primary (default) calendar** for overlap checks and **create** Occudule-sourced events on that calendar; users who connected before this scope was added must **sign in again** so Microsoft can issue a token that includes calendar access.

Grant admin consent in the tenant if required by organization policies.

---

## 4. Secrets & env vars

| Variable | Purpose |
|---|---|
| `MICROSOFT_CLIENT_ID` | Application (client) ID from Entra |
| `MICROSOFT_CLIENT_SECRET` | Client secret (for confidential client / server-side token exchange) |
| `BACKEND_BASE_URL` | Must match the **Web** redirect URI host used in §1 |

---

## 5. Related app identifiers (reference)

| Item | Value |
|---|---|
| iOS bundle ID | `com.occudule.app` |
| Android package | `com.occudule.app` |
| App deep link scheme (post-OAuth return to app) | `occudule://` (`OAUTH_APP_REDIRECT_SCHEME` in backend `.env`) |

---

## 6. Information still needed (beyond local-only defaults)

| Item | When it matters |
|---|---|
| **Stable production API URL** | Register production **Web** redirect `https://<api>/oauth/microsoft/callback` and set `BACKEND_BASE_URL` in production env. |
| **Confirmation ngrok vs localhost** | If the team standardizes on ngrok for device testing, document the current tunnel host in team notes (it changes when the tunnel restarts unless using a reserved domain). |
| **Tenant policy** | If only work/school accounts or only personal accounts are required, Entra “Supported account types” may need to change; authorize URL may use a specific tenant instead of `/common` (code currently uses `common`). |
| **Admin consent** | Some orgs require an admin to consent to `Mail.Read` / `Calendars.ReadWrite` before users can connect. |
| **Secret rotation cadence** | Operational policy for rotating `MICROSOFT_CLIENT_SECRET` (Entra secrets expire if you set an expiry). |
