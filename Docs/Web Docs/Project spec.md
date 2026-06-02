Act as an expert Senior Frontend Engineer specializing in React, Next.js (App Router), and Tailwind CSS.

Build a fully functioning, high-conversion marketing site for **Occudule** (AI email productivity for busy parents), owned by **Outvblue Technology Inc.** Layout and visual rhythm may take inspiration from [Nexora](https://bima-ai.webflow.io/), but **section order and footer structure must follow this spec exactly**.

Use a **Single Source of Truth** for design so colors, fonts, and global layout spacing can be swapped instantly from a central file.

---

### 1. Design System & Theme Token Configuration

Configure a global design token system using Tailwind CSS variables (or a central theme file) so the entire site dynamically reacts to global theme changes.

- **Font family:** Inter (primary sans; load via `next/font/google` or Tailwind).
- **Primary / dark slate:** `#0A2540` — deep backgrounds, heavy sections, main hero text.
- **Accent light blue / cyan:** `#67E8F9` — gradient highlights, accents, secondary emphasis.
- **Success / emerald green:** `#34D399` — positive metrics, trust badges.
- **Attention / alert orange:** `#F97316` — **only** for primary CTAs, active focal points (not decorative UI).

---

### 2. Typography & Hierarchy Expectations

- Enforce a clear, scannable semantic hierarchy: `<h1>`, `<h2>`, `<h3>`, `<p>`, and small uppercase section badges where appropriate.
- Apply `tracking-tight` on large headlines (H1, H2) for a premium SaaS feel.
- Use SEO-friendly page titles, meta descriptions, and semantic landmarks: `<header>`, `<main>`, `<section>`, `<footer>`.
- Legal pages (`/privacy`, `/terms`) render synced Markdown from `content/legal/` (Option B: copy from mobile app before deploy).

---

### 3. Website Sections (Home Page)

Build the landing page as **modular React components** in this **exact order**. Each section should have a stable `id` for in-page navigation (header and footer links).

| # | Section | Purpose | Suggested anchor `id` |
|---|---------|---------|------------------------|
| 1 | **Home (Hero)** | Primary value proposition, dual CTAs, cyan radial glow behind headline; centered or split layout per brand. | `top` or `home` |
| 2 | **Why Choose Occudule** | Differentiators and benefits; card or grid layout explaining why parents choose the product. | `why-occudule` |
| 3 | **Features** | Product capabilities (triage, drafts, family context, etc.); clean bordered cards, rounded edges. | `features` |
| 4 | **How it works** | Step-by-step or process flow (connect → organize → reply). | `how-it-works` |
| 5 | **Pricing plans** | Plan tiers, billing toggle if applicable, primary/secondary CTAs per plan. | `pricing` |
| 6 | **FAQ** | Accordion or expandable Q&A; addresses common objections before signup. | `faq` |

**Global header / navbar (above sections 1–6):**

- Occudule logo (image from `public/occudule-logo.png`).
- Nav links aligned to the six sections above (labels may shorten for space, e.g. “Features”, “Pricing”).
- Secondary text action (e.g. Sign in / Contact) and primary CTA (orange): e.g. “Get early access”.
- Sticky, minimal, backdrop blur; links use `/#section-id` so they work from subpages (legal).

**Optional (not in numbered list):** closing CTA band above the footer, social proof, or testimonials may sit between FAQ and footer if product/marketing requires—only add if explicitly requested later.

---

### 4. Footer Structure

Multi-column footer on all marketing pages. Use dark primary background and light text. Company block includes **Outvblue Technology Inc.**, address, and **support@occudule.com**.

#### 4.1 Quick Links

| Link label | Target |
|------------|--------|
| Home | `/` or `/#top` |
| Features | `/#features` |
| How it works | `/#how-it-works` |
| Pricing | `/#pricing` |
| FAQ | `/#faq` |

#### 4.2 Corporate

| Link label | Target |
|------------|--------|
| About Us | Dedicated page or `/#about` section (implement when content exists) |
| News | Dedicated page or placeholder route (implement when content exists) |
| Articles | `/#articles` or `/articles` when blog exists |
| Contact | `mailto:support@occudule.com` or contact section |

#### 4.3 Legal

| Link label | Target |
|------------|--------|
| Privacy | `/privacy` (renders `content/legal/privacy_policy_screen.md`) |
| Terms | `/terms` (renders `content/legal/terms_of_service_screen.md`) |

Footer bottom bar: copyright **Outvblue Technology Inc.**, current year, short Occudule tagline.

---

### 5. Code Architecture & Documentation

- **Stack:** Next.js App Router, React, TypeScript, Tailwind CSS; deploy on Vercel from GitHub.
- **Components:** One component (or folder) per major section; shared `Header`, `Footer`, `CtaButton`, `Logo`, theme tokens in `app/globals.css` + `tailwind.config.ts`.
- **Legal sync (Option B):** Author in mobile app → copy into `content/legal/` → deploy web. See `content/legal/README.md`.
- **README:** Document folder structure, npm scripts, theme customization, and deploy steps.

---

### 6. Brand & Contact Reference

- **Product:** Occudule  
- **Company:** Outvblue Technology Inc.  
- **Email:** support@occudule.com  
- **Address:** Suite 500, 7030 Woodbine Avenue, Markham, Ontario L3R 6G2  
