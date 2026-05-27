# Subscription payment — manual test checklist

Use this when validating **in-app purchase (IAP)** end-to-end: **Apple / Google → RevenueCat → Occudule backend → app UI**.

Related docs: [Product_Spec.md](Product_Spec.md) §5, [occudule_iap_plan.md](occudule_iap_plan.md), mobile `lib/revenueCat.ts` (entitlements & product ids).

**Plan effective date:** See [occudule_iap_plan.md §3](occudule_iap_plan.md) — first purchase date of the **currently active** store subscription product (`original_purchase_date`), returned as `plan_effective_at` on `GET /users/me/subscription` after a successful RevenueCat sync.

---

## Prerequisites

- [ ] **Signed-in Occudule user** on a **physical device or emulator** that supports IAP (not web-only Expo Go limitations—use dev client / store build as you normally ship).
- [ ] Mobile `.env`: `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` set; app rebuilt after changes.
- [ ] Backend `.env`: `REVENUECAT_SECRET_API_KEY` (server → RevenueCat REST) set; `DATABASE_URL` points at a DB with **seeded** `subscriptions` rows (FREE / PREMIUM / DIAMOND).
- [ ] **RevenueCat**: offerings, packages, products wired; entitlements **`premium_access`** and **`diamond_access`** match [occudule_iap_plan.md](occudule_iap_plan.md) / `mobile/lib/revenueCat.ts`.
- [ ] **App user ID**: After login, RevenueCat is configured to use the **Occudule user id** as `app_user_id` (so `POST /users/me/subscription/sync` updates the correct row).
- [ ] **Store testers**
  - [ ] **iOS**: Sandbox Apple ID; app from TestFlight or dev build with StoreKit / sandbox.
  - [ ] **Android**: License test accounts; app signed with a build that can reach Play billing.

---

## RevenueCat webhook (production-like)

- [ ] Backend reachable at **HTTPS** `POST /webhooks/revenuecat`.
- [ ] `REVENUECAT_WEBHOOK_AUTHORIZATION` set in backend; **same** secret in RevenueCat → Integrations → Webhooks.
- [ ] Send RevenueCat **TEST** event (should return 200, no duplicate errors in logs).
- [ ] After a real purchase in sandbox, confirm webhook fires (or rely on manual sync below if webhook not exposed yet).

---

## Core flows — iOS

Repeat critical rows on **Android** as well.

### Free baseline

- [ ] Sign in → **Subscription** screen shows **Free** / no paid entitlements on device card.
- [ ] **GET /users/me/subscription** (via app or API): `plan_tier` **FREE**, `subscription_status` **none** or **expired** as expected.

### Purchase Premium

- [ ] Open paywall → complete **Premium** purchase (sandbox).
- [ ] App: Subscription / debug area shows **Premium** entitlement active.
- [ ] Tap **Sync with Occudule server** (or wait for webhook) → server snapshot shows **PREMIUM**, **active** (or **grace** if simulating billing issue later).
- [ ] **Feature smoke** (examples): sibling conflict detection runs (not Premium-wall message for sibling line when in range); Outlook calendar integration allowed if Microsoft connected; **no** AI draft reply (Diamond only).

### Purchase / upgrade to Diamond

- [ ] From Premium (or from Free if paywall allows), purchase **Diamond**.
- [ ] Sync server → **DIAMOND**, **active**.
- [ ] **Feature smoke**: AI draft reply endpoints succeed; Diamond-only UI matches [AI_Draft_Reply_Spec.md](App%20Features/AI_Draft_Reply_Spec.md).

### Restore purchases

- [ ] New install or **Restore purchases** from Subscription screen.
- [ ] Entitlements return; **sync** updates backend to same tier.

### Downgrade / cancel (sandbox behavior)

- [ ] Cancel or let subscription lapse per store sandbox rules.
- [ ] After RC reflects expiry, **sync** → `plan_tier` **FREE** (or **expired** status), limits tighten (email cap, children, institutions, whitelist, conflict/calendar/draft gates).

### Grace period (if you can trigger)

- [ ] Simulate **billing issue** in sandbox / RC test tools if available.
- [ ] Backend maps to **`grace`** where intended; app still treats user as **Premium/Diamond** for gating during grace (verify against your product rules).

---

## Core flows — Android

- [ ] Same **Purchase Premium**, **Diamond**, **Restore**, **lapse** checks as iOS.
- [ ] Confirm **Google Play** products and **RevenueCat** Android app configuration match iOS entitlements.

---

## Server sync & API

- [ ] **POST /users/me/subscription/sync** while logged in: returns 200 and updated `plan_tier`, `subscription_status`, `period_end_at`, quota blocks (`email_processing`, `children_slots`, etc.).
- [ ] Invalid / missing RC subscriber: sync fails gracefully; app shows a clear message (no silent wrong tier).

---

## Feature gating sanity (after tier change)

Quick pass after **sync**—adjust rows to match [Plan_Comparison.md](Plan_Comparison.md).

| Area | Free | Premium | Diamond |
|------|------|---------|---------|
| Email processing monthly cap | ☐ | ☐ (unlimited) | ☐ |
| Sibling conflict: real check vs Premium message | ☐ | ☐ | ☐ |
| External calendar conflict / integration | ☐ | ☐ | ☐ |
| AI draft reply | ☐ blocked | ☐ blocked | ☐ works |
| Calendar write / OAuth calendar scopes | ☐ | ☐ | ☐ |

---

## Edge cases

- [ ] **Purchase while logged out** → sign in → restore + sync restores correct tier.
- [ ] **User deleted in app** but subscription still on Apple/Google — support path documented (not a code test).
- [ ] **Two devices**, same account: purchase on A; open B → restore or sync shows same tier.
- [ ] **Subscription screen** “verifying” copy after purchase if server lags — user can sync manually.

---

## Sign-off

| Date | Tester | Platform(s) | Build / version | Notes |
|------|--------|-------------|-----------------|-------|
|      |        |             |                 |       |
