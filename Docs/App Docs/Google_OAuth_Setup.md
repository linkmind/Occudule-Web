# Google OAuth — Redirect URIs, People API, and Setup

Occudule uses a **Google Cloud OAuth Web client** for Profile **Connect Google** (Contacts + optional Calendar). This is separate from **Sign in with Google** on the login screen (same or related client IDs depending on environment).

**Related:** [OAuth and scopes matrix](OAuth_And_Scopes_Matrix.md) · `backend/.env.example`

---

## 1. Enable People API (required for “Add to Contacts”)

Profile **Add to Contacts** creates **Occudule Forward** in the user’s **Google Contacts** via the [People API](https://developers.google.com/people) (`people:createContact`).

If People API is not enabled on the GCP project that owns `GOOGLE_CLIENT_ID`, Add to Contacts fails with an error like *“Google People API is not enabled for this app”*.

### Steps

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select the project tied to **`GOOGLE_CLIENT_ID`** (same project as your OAuth consent screen).
2. Go to **APIs & Services → Library**.
3. Search **People API** (not the legacy “Contacts API”).
4. Click **Enable**.
5. Wait 1–2 minutes, then retry **Add to Contacts** in the app (no need to reconnect Gmail unless you also lacked Contacts OAuth scope).

Direct link pattern (replace `PROJECT_ID`):

`https://console.developers.google.com/apis/api/people.googleapis.com/overview?project=PROJECT_ID`

Enable this on **every** environment’s Google project (local dev OAuth app, staging, production).

---

## 2. OAuth client and redirect URIs

| Use | Redirect URI | Where to register |
|-----|--------------|-------------------|
| Profile Connect Google | `{BACKEND_BASE_URL}/oauth/google/callback` | OAuth Web client → Authorized redirect URIs |
| Mobile Sign in with Google (PKCE) | `{BACKEND_BASE_URL}/oauth/google/mobile-signin-callback` | Same Web client |

Set `BACKEND_BASE_URL` in `backend/.env` (no trailing slash). Examples:

- Local: `http://localhost:3000`
- ngrok: `https://your-subdomain.ngrok-free.dev`
- Staging/production: `https://api-staging.occudule.com` / `https://api.occudule.com`

---

## 3. OAuth scopes (Connect Google)

Requested in `backend/src/modules/oauth/oauth.service.ts`:

| Scope | Purpose |
|-------|---------|
| `https://www.googleapis.com/auth/contacts` | Add Occudule forward address to Google Contacts |
| `https://www.googleapis.com/auth/calendar.freebusy` | Conflict detection (Premium+) |
| `https://www.googleapis.com/auth/calendar.events.owned` | Mirror events to Google Calendar (Premium+) |
| `https://www.googleapis.com/auth/userinfo.email` | Identify connected account |
| `openid` | OpenID Connect |

Users who connected **before** the Contacts scope was added must tap **Connect here** on User Profile again and approve Contacts access.

---

## 4. Backend environment

| Variable | Notes |
|----------|--------|
| `GOOGLE_CLIENT_ID` | Web client ID |
| `GOOGLE_CLIENT_SECRET` | Web client secret |
| `GOOGLE_MOBILE_CLIENT_ID` | Optional Android client; falls back to `GOOGLE_CLIENT_ID` |
| `BACKEND_BASE_URL` | Must match registered redirect URI host |

---

## 5. Manual test — Add to Contacts

1. User Profile → set and save **sync email** (Gmail).
2. Tap **Connect here** → complete Google OAuth.
3. Confirm forward address appears under **Email forwarding**.
4. Tap **Add to Contacts** → expect success alert.
5. Verify at [contacts.google.com](https://contacts.google.com) — contact name **Occudule Forward** with your `@inbound.occudule.com` address.

If you see **Contacts permission is missing**, reconnect Gmail (step 2) and accept Contacts.

If you see **People API is not enabled**, complete §1 above.
