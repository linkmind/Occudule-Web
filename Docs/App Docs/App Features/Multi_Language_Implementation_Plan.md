# Multi-language implementation plan (mobile)

**Status:** baseline implemented in the mobile app (i18n wired for `en`, `fr`, `es`, `zh-CN`, `zh-TW`; many screens migrated to `t()`). Remaining screens/components may still contain English literals until migrated.  
**Last updated:** 2026-04-18

This document records the product and engineering plan for a full in-app localization experience driven by **preferred language** (Settings). It supersedes ad hoc discussion; keep it updated as scope changes.

### Engineering notes (mobile)

- **Locale files:** `mobile/i18n/locales/{en,fr,es,zh-CN,zh-TW}.json` — English is the master list of keys; other languages mirror the same structure.
- **Partial translation maps (FR/ES/ZH):** `mobile/i18n/maps/` holds fragment JSON used to build `fr.flat.merged.json` / `es.flat.merged.json` via `mobile/scripts/merge-flat-maps.mjs`, then `mobile/scripts/apply-flat-locale.mjs` writes `fr.json` / `es.json`. Chinese: edit `zh-CN.json`, then run `node mobile/scripts/zh-cn-to-tw.mjs` to regenerate **`zh-TW.json`** from **`zh-CN.json`** (OpenCC `cn` → `tw`).
- **Runtime:** `mobile/i18n/index.ts` registers all five locales; `mobile/lib/i18nLocale.ts` exposes `bcp47FromI18nLanguage` for `Intl` date formatting.

---

## 1. Goal

Deliver a **full UI** localized to **five** languages:

| Code (stored) | Description |
|---------------|-------------|
| `en` | English |
| `fr` | French |
| `es` | Spanish |
| `zh-CN` | Simplified Chinese |
| `zh-TW` | Traditional Chinese |

The active language follows **preferred language** (persisted on the user profile and applied app-wide after login / on change).

**Internal convention:** Use these codes **consistently** everywhere: mobile `i18n`, AsyncStorage cache, `PATCH /users/me` (`preferred_language`), and any backend logic that reads `preferred_language`. Do not mix alternate codes (e.g. `zh-Hans` / `zh-Hant`) unless the team migrates all layers in one pass.

---

## 2. Scope

| Topic | Decision |
|--------|-----------|
| **Locales to ship** | `en`, `fr`, `es`, `zh-CN`, `zh-TW` |
| **Coverage** | **Entire app:** all user-visible copy (screens, tabs, stack titles, modals, `Alert`, placeholders, empty states, toasts). |
| **Tone** | **Formal** in every locale. Provide short **translator notes** per language (e.g. French *vous*, formal Spanish *usted*, formal Chinese 您 / 正式用语). |
| **Terms of Service & Privacy Policy** | **English only.** Optional: a one-line notice that the binding legal text is in English. |
| **About this app** | **Localized** according to preferred language. |
| **Errors (API / technical)** | **English only** for the initial release. No requirement to wrap server messages in `t()` yet. |
| **Accessibility (VoiceOver / TalkBack)** | Prefer the **same translation keys as visible text** for `accessibilityLabel` / hints when the visible string is sufficient. Use **separate keys** (e.g. `a11y.*`) only when screen-reader wording must differ (icon-only buttons, extra context). Keep **formal** register consistent in a11y strings. Note: OS TTS language may differ from in-app language if the user sets app language ≠ device language. |

### 2.1 Presenting Chinese variants in the language picker

- **User-facing labels (English UI):** e.g. “Simplified Chinese” / “Traditional Chinese,” or “Chinese (Simplified)” / “Chinese (Traditional).”
- **User-facing labels (Chinese UI):** e.g. **简体中文** / **繁體中文** for a natural reading experience.
- **Stored values:** `zh-CN` and `zh-TW` (or a future unified migration to `zh-Hans` / `zh-Hant` — document any change here).

---

## 3. Technical approach (mobile)

1. **i18next / react-i18next** — Register resource bundles for all five locales. Use **English as the fallback** for missing keys during migration.
2. **Strings** — Avoid raw user-visible literals in UI code; route copy through **`t('key')`** with a **stable key scheme** (e.g. `screen.section.element`).
3. **Pluralization, dates, numbers** — Use **`Intl`** (or project helpers) with the **active locale** from i18n.
4. **Alerts and dynamic strings** — Use interpolation and plural forms where needed; do not forget pickers and system-style dialogs.

---

## 4. Backend alignment

- **`preferred_language`** remains the source of truth on the server; keep it in sync with the app when the user changes language in Settings.
- **Home / email summaries:** Existing behavior may **translate AI-generated summaries** into the user’s preferred language at read time. **UI language and summary target language should stay aligned** so users do not see e.g. French UI with English-only summaries unintentionally.
- **Localized API error messages** are **out of scope** for v1; errors stay English until a later phase (e.g. error codes + client strings).

---

## 5. Delivery order

1. **Foundation** — Key naming conventions, shared glossary (product terms in five languages), translator handoff process.
2. **String migration** — Replace literals **by user journey** (e.g. onboarding → home → calendar → profile → settings) so flows are not half-localized.
3. **About this app** — Localized; legal screens remain English-only as specified.
4. **QA** — Switch language in-app, check truncation, formal tone, and critical paths in each locale.
5. **Optional later** — Lazy-load locale bundles, CI checks for key parity, localized API errors.

---

## 6. Out of scope (initial release)

- RTL languages (e.g. Arabic, Hebrew) unless added in a future phase.
- Full translation of **Terms** and **Privacy** body text.
- Localized **API error** messages.

---

## 7. Related documents

- [../Screens/settings_screen_spec.md](../Screens/settings_screen_spec.md) — Settings, including language preference.
- [../Screens/about_this_app_screen_spec.md](../Screens/about_this_app_screen_spec.md) — About content (localized per this plan).

---

*This plan was agreed with product: must-ship locales include English, French, Spanish, Simplified Chinese, and Traditional Chinese; entire-app coverage; formal tone; legal English-only; About localized; errors English-only for now.*
