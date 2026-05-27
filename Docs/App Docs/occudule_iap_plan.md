# Occudule IAP Plan (RevenueCat)

## 1) Decisions Locked

- Billing channel: iOS/Android IAP only
- Billing platform: RevenueCat as subscription source/aggregator
- Entitlement source in app: backend API (mirrors RevenueCat), not raw client purchase state

## 2) Product Model (single source of truth)

- Define store product IDs (Apple + Google) per plan:
  - `premium_monthly`
  - `premium_yearly`
  - `diamond_monthly`
  - `diamond_yearly`
  - *(optional)* intro/trial variants
- In RevenueCat:
  - Products → Offerings → Packages
  - Use separate paid-tier entitlements:
    - `premium_access`
    - `diamond_access`
- Map active entitlement to backend tier/status:
  - `premium_access` active → `plan_tier=PREMIUM`
  - `diamond_access` active → `plan_tier=DIAMOND`
  - none active → `plan_tier=FREE`
  - `subscription_status` resolved by backend as `active`, `grace`, or `expired`

## 3) Backend Contract *(implemented)*

**Plan effective date (Subscription screen):** The calendar date of the **first purchase** of the user’s **currently active** store subscription product — i.e. RevenueCat `subscriptions[active_product_id].original_purchase_date` (mirrored as `plan_effective_at` after sync). After an upgrade to a different product, the next successful sync replaces this with that product’s original purchase date.

**Database (migration `026_user_iap_revenuecat.sql` plus `039_users_iap_plan_billing_meta.sql`):** `users.rc_app_user_id`, `users.iap_subscription_status` (`active` | `grace` | `expired` | `none`), `users.iap_period_end_at`, `users.iap_last_synced_at`, `users.iap_plan_effective_at`, `users.iap_billing_period` (`monthly` \| `yearly` when inferred), `users.iap_price_label` (optional formatted price when RC provides it); table `revenuecat_webhook_events` (`event_id` PK) for idempotency.

**Endpoints:**

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/users/me/subscription` | JWT | Current snapshot: `plan_tier`, `subscription_status`, `period_end_at`, `plan_effective_at`, `renewal_period`, `plan_price_display`, `provider`, `rc_app_user_id`, `synced_at`, plus quota blocks |
| `POST` | `/users/me/subscription/sync` | JWT | Calls RevenueCat REST `GET /v1/subscribers/{app_user_id}`, updates DB, returns same shape as GET |
| `POST` | `/webhooks/revenuecat` | Optional `Authorization` header = `REVENUECAT_WEBHOOK_AUTHORIZATION` | Webhook; dedupes by event `id`, then syncs subscriber from RevenueCat API |

**Backend env:** `REVENUECAT_SECRET_API_KEY` (secret API key for REST), `REVENUECAT_WEBHOOK_AUTHORIZATION` (optional; must match RevenueCat webhook integration).

**Mobile:** After purchase/restore, calls `POST /users/me/subscription/sync` then uses `useSubscriptionGate()` — backend truth with a short **verifying** window using RevenueCat SDK entitlements until the server catches up.

## 4) Identity Linking *(critical with RevenueCat)*

- Decide and enforce one `appUserID` strategy:
  - Use your backend `user.id` as RevenueCat `appUserID`
- On login/logout:
  - `identify` / `logIn` to RevenueCat on auth (always with backend `user.id`)
  - `logOut` / `reset` on app logout
- Prevent anonymous/identified user mix-ups

## 5) Mobile Implementation (RevenueCat SDK)

- **Paywall screen:**
  - Fetch offering/packages
  - Purchase
  - Restore purchases
- **Settings subscription section:**
  - Current plan/status
  - Manage subscription deep link (store-managed)
- **After purchase/restore:**
  - Trigger backend entitlement refresh/sync
  - Then refresh local user state
  - Show immediate in-app plan update optimistically, then reconcile with backend as the final source of truth

## 6) Entitlement Gating Rules

- Gate premium features from backend subscription endpoint
- Add fallback states:
  - `verifying` (post-purchase)
  - `temporary_unavailable` (network/webhook lag)
- Never permanently unlock on client purchase callback alone

### 6.1 Backend Entitlement State Model (active/grace/expired)
- `active`
  - RevenueCat reports the subscription entitlement as currently valid (not expired).
  - Premium features: ON.
- `grace`
  - RevenueCat indicates the subscription is in a billing-issue grace window (grace end timestamp still in the future, e.g. via `grace_period_expires_date` / `grace_period_expiration_at_ms` depending on integration).
  - Premium features: ON (but treated as temporary access).
  - When the grace end timestamp passes, transition to `expired`.
- `expired`
  - RevenueCat entitlement is no longer valid (grace/expiration end timestamp is in the past).
  - Premium features: OFF.

### Grace Duration Configuration (store-level)
- Apple App Store grace period (configured in App Store Connect):
  - Monthly subscriptions: 3 days
  - Yearly subscriptions: 16 days
- Backend logic should still be driven by RevenueCat-provided entitlement/grace timestamps (not hardcoded day counts), so behavior stays correct across both iOS and Android.

## 7) Testing Matrix *(must pass before dev build signoff)*

- [ ] New purchase (iOS + Android sandbox)
- [ ] Restore on fresh install
- [ ] Renewal cycle (sandbox fast renewals)
- [ ] Cancellation and expiration
- [ ] Billing retry/grace handling
- [ ] Login on second device reflects same entitlement
- [ ] Offline startup behavior + retry once online

## 8) Operational/Store Readiness

- App Store Connect + Play Console products active for testing
- RevenueCat project configured for both stores
- Webhook secret verification + monitoring logs
- Privacy/Terms text updated for auto-renewing subscriptions
- Support FAQ: cancel/manage/restore paths

## 9) Suggested Sprint Order

1. Store + RevenueCat configuration
2. ~~Backend subscription model + `GET /users/me/subscription`~~ *(done)*
3. ~~RevenueCat webhook ingestion + idempotency~~ *(done)*
4. ~~Mobile paywall + restore + `POST /users/me/subscription/sync` + `useSubscriptionGate`~~ *(done)*
5. Settings subscription section + product feature gating (use `useSubscriptionGate` in Premium/Diamond screens)
6. End-to-end sandbox QA + app review prep
