# Occudule — marketing site

Landing page for **Occudule**, an AI email productivity product for busy parents. Built with **Next.js (App Router)**, **React**, and **Tailwind CSS**, ready to deploy on [Vercel](https://vercel.com) from a [GitHub](https://github.com) repository.

## Folder structure

| Path | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, Inter via `next/font/google`, SEO metadata |
| `app/page.tsx` | Composes landing sections |
| `app/globals.css` | **Single source of truth** for CSS variables (colors, radii, shadows, spacing) |
| `tailwind.config.ts` | Maps CSS variables to Tailwind tokens (`bg-primary`, `text-cta`, etc.) |
| `lib/theme.ts` | Short semantic notes (optional reference) |
| `components/` | Modular UI blocks: `Header`, `Hero`, `Features`, `SocialProof`, `ClosingCta`, `Footer`, `CtaButton` |

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # run production build locally
npm run lint
```

## Deploy (GitHub + Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import the repository.
3. Framework preset **Next.js**, root directory `.`, build `npm run build`, output default.
4. Deploy. Vercel sets `GITHUB` integration for previews on PRs automatically.

## Changing theme (colors, fonts, spacing)

1. **Colors & layout tokens** — edit `:root` in `app/globals.css` (e.g. `--color-primary`, `--color-cta`, `--spacing-section`). Tailwind classes like `bg-primary`, `text-accent`, `rounded-card` update everywhere.
2. **Font** — change the `Inter` import in `app/layout.tsx` to another `next/font/google` family, and keep `variable: "--font-sans"` so `globals.css` / Tailwind `font-sans` stay wired.
3. **Tailwind aliases** — if you add new CSS variables, extend `tailwind.config.ts` under `theme.extend` so they become utilities.

Contact: **support@occudule.com**. Company: **Outvblue Technology Inc.** (Suite 500, 7030 Woodbine Avenue, Markham, Ontario L3R 6G2). Update footer legal links when you have dedicated Privacy/Terms pages.
