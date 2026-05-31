# System Specification: Occudule "About Us" Page

## 1. Document Overview
* **Project Name:** Occudule Web Platform [cite: 2]
* **Page Target:** `/about` (About Us Page) [cite: 2, 3]
* **Design Philosophy:** Minimalist, high-end, clean SaaS aesthetic [cite: 2].
* **Target Audience:** Busy parents, educational administrators, and early-stage startup investors [cite: 2].

---

## 2. SEO & Global Metadata
```json
{
  "meta_title": "About Us | Occudule — Made by Parents, for Parents",
  "meta_description": "Discover the mission behind Occudule. Founded in Ontario, we harness innovative technology to clear the digital clutter of parenting and ease the family mental load.",
  "open_graph": {
    "og_title": "About Occudule | Empowering Modern Families",
    "og_description": "We build elegant tech solutions to streamline school logistics, schedules, and family communication.",
    "og_type": "website",
    "og_image": "/assets/og-about-us.png"
  }
}
```

---

## 3. Design System & Theme Token Configuration
This page must subscribe strictly to the single source of truth design token system defined in the core project spec [cite: 3, 4]:

* **Font Family:** `Inter` (Primary sans font loaded via `next/font/google` or Tailwind) [cite: 3, 4].
* **Primary / Dark Slate:** `#0A2540` — Used for deep section backgrounds, heavy sections, and main headings [cite: 3, 4].
* **Accent Light Blue / Cyan:** `#67E8F9` — Used for gradient highlights, background radial glows, and secondary emphasis [cite: 3, 4].
* **Success / Emerald Green:** `#34D399` — Applied to positive metrics or subtle trust highlights [cite: 3, 4].
* **Attention / Alert Orange:** `#F97316` — **Strictly reserved** for primary interactive elements/CTAs and active focal points (no decorative usage) [cite: 3, 4].
* **Typography Hierarchy:** Implement `tracking-tight` on the large headlines (H1, H2) to maintain a premium SaaS feel [cite: 3, 4].

---

## 4. Component Structure & Content Implementation
The page must be built as modular React components using clean semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`) [cite: 3].

```
[Global Header / Navbar] -> (Sticky minimal layout with backdrop blur, logo from public/occudule-logo.png) [cite: 3, 4]
   └── <main className="max-w-5xl mx-auto px-4 py-16 md:py-24"> [cite: 2, 4]
         ├── <AboutHero /> (Mission block with a cyan radial glow behind the headline) [cite: 3, 4]
         ├── <ValuesGrid /> (3-column bordered cards layout with rounded edges) [cite: 2, 3, 4]
         └── <NarrativeBlock /> (Asymmetric split content detailing Company + Product) [cite: 2, 4]
[Global Multi-Column Footer] -> (Dark primary background #0A2540 with light text) [cite: 3, 4]
```

### Section 1: `<AboutHero />`
* **Layout:** Centered or left-aligned high-impact typography showcasing the core value proposition [cite: 2]. Features a subtle background cyan radial glow highlight behind the copy [cite: 3, 4].
* **Content:** 
  > **Our Mission:** To champion parents and support their children’s success by leveraging the power of rapidly evolving technology [cite: 1].

### Section 2: `<ValuesGrid />`
* **Layout:** 3-column responsive grid card layout [cite: 2, 4]. Cards must feature a clean, crisp border and rounded edges (`rounded-xl` or `rounded-2xl`) [cite: 3, 4].
* **Interactions:** A subtle lift transition on hover (`transition-all duration-300 ease-in-out hover:-translate-y-1`) [cite: 2, 4].
* **Content Cards:**
  1. **Integrity & Excellence:** Do the right things, and do them right [cite: 1]. *(Micro-focus points can utilize alert orange text elements)* [cite: 3, 4].
  2. **Community-Minded:** Building solutions that uplift and connect families [cite: 1].
  3. **Tech-Savvy:** Embracing modern innovation to solve real-world parenting challenges [cite: 1].

### Section 3: `<NarrativeBlock />`
* **Layout:** High-contrast typography layout block separating the corporate narrative from the product deep-dive [cite: 2].
* **Content Elements:**
  * **Company Introduction:** **Outvblue Technology Inc.** is an Ontario-based technology company founded and run entirely by parents [cite: 1]. Grounded in our core philosophy—*"Made by parents, for parents"*—we harness innovative tech to help families thrive, beautifully balancing life at home and out in the world [cite: 1].
  * **Product Spotlight:** Our flagship product, **Occudule**, was born from a desire to clear the digital clutter of modern parenting [cite: 1]. It helps busy parents effortlessly stay on top of school and extracurricular logistics by automating the entire workflow [cite: 1]. Occudule seamlessly handles email processing, extracts key details, generates to-do lists, manages intelligent auto-replies, detects scheduling conflicts, and coordinates task assignments between family members [cite: 1].
  * **Closing Emphasis:** We take care of the mental load, so you can focus on what matters most [cite: 1].

### Section 4: Closing CTA Band
* **Layout:** Placed directly above the footer [cite: 3]. A minimalist block featuring a primary attention orange (`#F97316`) button [cite: 3, 4].
* **Text:** "Streamline Your Family Logistics Today" $ightarrow$ **Button Label:** "Get Early Access" [cite: 3]

---

## 5. Technical, Accessibility & Routing Integration
* **Accessibility (a11y):** Maintain text-to-background contrast metrics matching a minimum ratio of $4.5:1$ to strictly verify WCAG AA compliance [cite: 2, 4].
* **Header Router Links:** Global sticky navbar must cleanly integrate the route mapping to `/about` [cite: 3, 4].
* **Footer Mapping:** Sync explicitly with the global footer rules [cite: 4]:
  * **Corporate Column:** Points "About Us" explicitly to the `/about` path [cite: 3, 4].
  * **Corporate String details:** **Outvblue Technology Inc.**, *Suite 500, 7030 Woodbine Avenue, Markham, Ontario L3R 6G2* [cite: 3].
  * **Contact String target:** *support@occudule.com* [cite: 3].
