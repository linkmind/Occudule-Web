# Feature Spec: AI Draft Reply (Diamond Only)

## Overview

The **AI Draft Reply** feature is available exclusively to **Diamond** tier users. It allows users to generate a pre-drafted email reply directly from within the app, optionally guided by 1–3 clarifying questions from the AI.

---

## Screens

### 1. Event Confirmation Screen

**Field:** `Reply Required`

| State | Display |
|---|---|
| Reply is required | `Yes, Draft a Reply for me` — where **"Draft a Reply"** is a tappable hyperlink (Diamond only) |
| Reply is not required | `No` |


**"Draft a Reply" tap behavior:**
1. The AI **may ask the user 1–3 questions** to guide the reply.
2. Once questions are answered (or if no questions are needed), the app **opens the user's synced email account** with:
   - The original email pre-loaded
   - A pre-drafted reply ready to send

---

### 2. Event Details Screen

**Field:** `Reply Required`

| State | Display |
|---|---|
| Reply required + **no draft stored** | `Yes, Draft a Reply for me` — where **"Draft a Reply"** is a tappable hyperlink (Diamond only) |
| Reply required + **draft already stored** | `Yes, Reply Drafted` — where **"Reply"** is a tappable hyperlink (Diamond only) |
| Reply not required | `No` |

**"Draft a Reply" tap behavior** *(no draft stored):*
1. The AI **may ask the user 1–3 questions** to guide the reply.
2. Once questions are answered (or if no questions are needed), the app **opens the user's synced email account** with:
   - The original email pre-loaded
   - A pre-drafted reply ready to send

**"Reply" tap behavior** *(draft already stored):*
- The stored draft reply is displayed.
- The user can **copy the text** to use as needed.

---

### 3. Add Manual Event Screen

**Field:** `Reply Required`

- Displayed as a simple **Yes / No toggle** only.
- No AI draft functionality is shown on this screen.

**After saving the manual event:**
- On the Event Details page, only `Yes` or `No` is shown for this field.
- No additional draft reply content or links are displayed.

---

## Logic Summary

```
if event source == email:
  if reply_required == true:
    if draft exists in DB:
      show "Yes, Reply Drafted" (hyperlink → view/copy draft)
    else:
      show "Yes, Draft a Reply for me" (hyperlink → AI flow → open email client)
  else:
    show "No"

if event source == manual:
  show toggle: Yes | No
  // No draft reply UI on event details for manual events
```

---

## Access Control

| Feature | Free | Premium | Diamond |
|---|---|---|---|
| View Reply Required field | ✅ | ✅ | ✅ |
| "Draft a Reply" hyperlink | ❌ | ❌ | ✅ |
| "Reply Drafted" hyperlink | ❌ | ❌ | ✅ |

---

## Notes

- The AI may ask **0–3 questions** before drafting. If no questions are needed, it proceeds directly to opening the email client.
- The drafted reply is **stored in the database** per user per event, enabling the "Reply Drafted" state on return visits.
- The email client opened must be the user's **synced email account**.
- for non-diamond users, there will be still the link, but it brings up a reminder screen to show this is a diamond feature, and then show users a way to upgrade their plan just similar to what we did in other places in the app.
