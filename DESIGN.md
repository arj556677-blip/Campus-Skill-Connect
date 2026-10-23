# Campus Skill Connect — Design System (Meekoo Theme)

This document formalizes the visual system, color palette, typography hierarchy, and UI component standards across Campus Skill Connect, styled after modern, high-trust educational and creative collaboration platforms.

---

## 1. Aesthetic Foundations & Core Principles

- **Pure, Bright Light Theme**: Clean white surfaces (`#ffffff`) placed on soft canvas panels (`#f8fafc`), eliminating oppressive dark mode blocks while providing crisp readability and high contrast.
- **Electric Cobalt Accent**: Modern electric blue (`#1b59f8`) used intentionally for focal highlights, active category indicators, and verification badges.
- **Obsidian Pill CTAs**: Primary call-to-action buttons use high-contrast dark slate/obsidian (`#0f172a` hover: `#000000`) shaped as full rounded pills (`rounded-full`), echoing modern consumer software aesthetic.
- **Generous Curvature**: Soft, approachable geometry using `rounded-3xl` for major section panels and hero containers, `rounded-2xl` for content cards, and `rounded-full` for badges, tags, and buttons.
- **Subtle Elevation**: Light, non-distracting elevation shadows (`shadow-xs` / `shadow-sm`) paired with crisp slate borders (`border-slate-200`) instead of heavy artificial drop shadows.

---

## 2. Color Palette & Token Hierarchy

| Token Name | Hex Code | Tailwind Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `#f8fafc` | `bg-[#f8fafc]` | Page-level background canvas |
| **Surface White** | `#ffffff` | `bg-white` | Cards, hero containers, dropdowns, navigation shell |
| **Surface Sunken** | `#f1f5f9` | `bg-slate-100` | Filter pill backgrounds, search bars, table headers |
| **Border Slate** | `#e2e8f0` | `border-slate-200` | Card borders, divider rules, subtle separators |
| **Text Primary** | `#0f172a` | `text-slate-900` | Headings, titles, high-contrast labels |
| **Text Secondary** | `#475569` | `text-slate-600` | Subtitles, descriptions, body copy |
| **Text Muted** | `#94a3b8` | `text-slate-400` | Metadata timestamps, hints, input placeholders |
| **Accent Cobalt** | `#1b59f8` | `bg-[#1b59f8]` | Interactive buttons, floating badges, active tabs |
| **Obsidian Pill** | `#0f172a` | `bg-[#0f172a]` | Primary navigation CTAs, action triggers |
| **Verified Emerald** | `#10b981` | `text-emerald-600` | Online indicators, verified credentials, approvals |
| **Security Amber** | `#f59e0b` | `text-amber-600` | Confidential badges, Google Meet session indicators |
| **Alert Rose** | `#ef4444` | `text-rose-600` | Moderation warnings, destructive actions, reports |

---

## 3. Typography & Hierarchy

- **Font Family**: Standard sans-serif stack (`Inter`, `system-ui`, `-apple-system`, `sans-serif`) optimized for rendering clarity across dense technical resumes and portfolio titles.
- **Hero Headings**: `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900`.
- **Section Titles**: `text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight`.
- **Card Titles**: `text-base font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors`.
- **Body Copy**: `text-xs sm:text-sm text-slate-600 leading-relaxed`.
- **Badges & Meta**: `text-[11px] font-semibold tracking-wide uppercase` or sentence case.

---

## 4. Component Patterns & Archetypes

### 4.1 Navigation (`Navbar.tsx`)
- Frosted translucent white bar: `bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50`.
- Black brand mark: Clean modern typography with a dark pill icon.
- Navigation links: Pill hover states (`rounded-full hover:bg-slate-100 px-4 py-2 text-xs font-semibold`).
- Right CTA: Obsidian pill button `Login ↗` (`rounded-full bg-[#0f172a] hover:bg-black text-white px-5 py-2.5 text-xs font-bold`).

### 4.2 Hero Containers (`page.tsx`)
- Rounded giant card: `rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-xs`.
- Split grid: Left column features bold headlines, eyebrow tag, and CTA buttons; right column features high-res student imagery with floating badges (`50,000+ Students`, `Best Collaboration`).
- Metrics ribbon: Four-item summary with subtle center-dot separators (`100% · 48+ · 1,480+ · 85+`).

### 4.3 Portfolio & Showcase Cards (`WorkCard.tsx`)
- Container: White card `rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all`.
- Cover Image: 16:10 rounded thumbnail with top-left electric cobalt category pill and top-right directional arrow link (`↗`).
- Footer: Author avatar, name, and live telemetry metric pills (commits, views, likes).

### 4.4 Form Controls & Input Fields
- Inputs: `bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#1b59f8]`.
- Pill Search: `rounded-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 shadow-xs`.
- Buttons:
  - **Primary**: `rounded-full bg-[#0f172a] hover:bg-black text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-95`.
  - **Accent**: `rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-95`.
  - **Secondary / Ghost**: `rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 text-xs font-semibold shadow-xs`.

### 4.5 Modals & Overlays
- Backdrop: `bg-slate-900/60 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4`.
- Dialog Surface: `rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-900`.

---

## 5. Verification & Compliance Guidelines

- **Product Integrity**: All design choices honor `PRODUCT.md` requirements:
  - Peer collaboration first
  - Proof-over-claims verification
  - Zero fake ATS match percentages (strict rule-based parsing only)
  - 4-tier visibility enforcement via PostgreSQL RLS
  - Academic domain institutional verification (`.ac.in`, `.edu`)
