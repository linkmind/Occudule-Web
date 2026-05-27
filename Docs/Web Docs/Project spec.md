Act as an expert Senior Frontend Engineer specializing in React, Next.js (App Router), and Tailwind CSS. 

I need you to generate a fully functioning, high-conversion landing page inspired by the structure, layout, design, and sections of this site: https://nexora-finance-template.webflow.io/.

Please use the following specific brand guidelines and design systems. I want the architecture designed using a "Single Source of Truth" so that colors, fonts, and global layout spacing can be swapped instantly from a central file.

### 1. Design System & Theme Token Configuration
Configure a global design token system using Tailwind CSS variables (or a central theme file) so the entire site dynamically reacts to global theme changes.
- Font Family: "Inter" (Set as the primary sans font, optimized for Next.js via next/font/google or standard Tailwind configuration).
- Primary / Dark Slate: #0A2540 (Use for deep backgrounds, heavy sections, and main hero text).
- Accent Light Blue / Cyan: #67E8F9 (Use for gradient highlights, eye-catching accents, or secondary components).
- Success / Emerald Green: #34D399 (Use for metric increases, trusted badges, or positive accents).
- Attention / Alert Orange: #F97316 (Use exclusively for high-priority Call-To-Action buttons, active elements, and core focal points).

### 2. Typography & Hierarchy Expectations
- Document structure must strictly enforce an intentional, scannable semantic typography hierarchy.
- Use explicit `<h1/>`, `<h2/>`, `<h3/>`, `<p/>`, and small uppercase text badges for semantic clarity.
- For large headlines (H1 and H2), apply a subtle `tracking-tight` (letter-spacing) to give the Inter typeface a premium, modern SaaS product feel.
- Include proper, SEO-friendly page titles, meta text, and semantic section tags (`<header>`, `<main>`, `<section>`, `<footer>`).

### 3. Website Sections (Inspired by Nexora)
Build the landing page using modular components, flowing through these specific conversion zones:
- Global Header / Navbar: Minimalist design featuring a brand logo placeholder, clean inline links, and a sharp primary action button.
- Hero Section: Massive centered or split layout headline with tight tracking, a responsive paragraph descriptive subtext, and a prominent dual-button CTA zone utilizing the Attention Orange asset. Add a glowing radial gradient mask utilizing the Cyan accent behind the text.
- Feature Grid / Value Proposition: Card components demonstrating "how it works" or platform benefits, styled cleanly with consistent borders and rounded edges.
- Social Proof / Metrics Section: A clean horizontal block highlighting numbers, growth percentages (utilizing the Emerald Green token), or trusted company logos.
- Bottom CTA / Footer Section: A strong closing banner urging the user to sign up or get started, accompanied by structured multi-column footer links.

### 4. Code Architecture, Documentation & Output
- Deliver production-ready code. Use modular React components so the UI blocks remain reusable.
- Include a short, clear README markdown block in your output detailing the folder structure, package dependencies, and instructions on exactly how to modify the central theme colors/fonts if I want to update them in the future.