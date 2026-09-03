# Documentation index — Occudule

High-signal entry points for engineers and operators.

## Inbound email (Postmark) — **active**

| Document | Description |
|----------|-------------|
| [Inbound_Forward_Email_Spec.md](Inbound_Forward_Email_Spec.md) | **Canonical spec:** per-env inbound domain (`POSTMARK_INBOUND_DOMAIN`; prod `inbound.occudule.com`, staging/dev hostnames as configured), prefix+random address, sync-email validation, webhook secret URL, idempotency, `source=inbound` → Event Confirmation. |
| [Inbound_Email_Runbook.md](Inbound_Email_Runbook.md) | Operator runbook: streams, webhook checklist, Postmark setup order. |
| [ADR/002-inbound-forward-postmark.md](ADR/002-inbound-forward-postmark.md) | ADR: Postmark inbound supersedes passive Gmail metadata detection. |

## Gmail metadata + Pub/Sub — **deprecated (historical)**

| Document | Description |
|----------|-------------|
| [Gmail_Metadata_Notifications.md](Gmail_Metadata_Notifications.md) | Phase 0 plan; **superseded** — see Inbound_Forward_Email_Spec. |
| [Gmail_PubSub_Watch.md](Gmail_PubSub_Watch.md) | Ops guide for watch/Pub/Sub; **superseded** unless revived. |
| [ADR/001-gmail-metadata-forward-only-outlook-unchanged.md](ADR/001-gmail-metadata-forward-only-outlook-unchanged.md) | Partially superseded by ADR 002. |

## OAuth, Apple Sign In & Microsoft Outlook

| Document | Description |
|----------|-------------|
| [OAuth_And_Scopes_Matrix.md](OAuth_And_Scopes_Matrix.md) | Google vs Microsoft scopes; **Sign in with Apple is identity-only**; inbound forward path. |
| [Screens/registration_login_screen_spec.md](Screens/registration_login_screen_spec.md) | Login/register rules: Apple may create an account with any Apple-provided email; mail sync still Gmail/Microsoft. |
| [Microsoft_OAuth_Setup.md](Microsoft_OAuth_Setup.md) | Entra redirect URIs and local setup. |
| [Microsoft_Outlook_Implementation_Checklist.md](Microsoft_Outlook_Implementation_Checklist.md) | Outlook implementation checklist. |

## Architecture & product

| Document | Description |
|----------|-------------|
| [System_Architecture.md](System_Architecture.md) | Stack and layers. |
| [Product_Spec.md](Product_Spec.md) | Product specification. |
| [App Features/Multi_Language_Implementation_Plan.md](App%20Features/Multi_Language_Implementation_Plan.md) | **i18n plan:** locales (en, fr, es, zh-CN, zh-TW), scope, tone, legal vs About, errors, accessibility. |
| [App Features/Account_Email_Verification_Implementation_Plan.md](App%20Features/Account_Email_Verification_Implementation_Plan.md) | **Auth plan:** email/password registration must verify inbox before JWT; Postmark + backfill for existing users. |
| [App Features/Family_Group_Invite_Implementation_Plan.md](App%20Features/Family_Group_Invite_Implementation_Plan.md) | **Family plan:** owner invites Gmail/Microsoft members; shared plan & data; owner-only email sync; member calendar sync; web join flow. |
| [App Features/Email_Filtering_Feature_Spec.md](App%20Features/Email_Filtering_Feature_Spec.md) | Filtering pipeline for inbound mail. |
| [Privacy_And_Consent_Copy_Checklist.md](Privacy_And_Consent_Copy_Checklist.md) | In-app and compliance copy checklist. |

## Legal (source files for in-app screens)

| Document | Description |
|----------|-------------|
| [../assests/legal/privacy_policy_screen.md](../assests/legal/privacy_policy_screen.md) | Privacy policy (Markdown used by app). |

---

*Last updated: 2026-09-03 (Sign in with Apple: identity-only; any Apple-provided email may create an account)*
