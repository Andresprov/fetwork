---
name: FETWork Campus Talent
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#41493e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#1b6d24'
  on-secondary: '#ffffff'
  secondary-container: '#a0f399'
  on-secondary-container: '#217128'
  tertiary: '#00442d'
  on-tertiary: '#ffffff'
  tertiary-container: '#005e3f'
  on-tertiary-container: '#4ddda2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#a3f69c'
  secondary-fixed-dim: '#88d982'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  container-max: 1280px
---

## Brand & Style

This design system delivers an institutional, modern, and accessible career portal experience tailored for university students, alumni, faculty coordinators, and corporate recruiters connected to the Fundación Escuela Tecnológica de Neiva Jesús Oviedo Pérez (FET).

The visual aesthetic operates within **Corporate / Modern** principles, enriched with high-contrast institutional indicators and streamlined navigation inspired by academic management portals like Q10. The design conveys institutional credibility, career opportunity, civic pride, and academic rigor.

Core attributes:
- **Institutional Rigor:** Deep forest greens establish stability, longevity, and academic trust.
- **Dynamic Growth:** Emerald and lime accents energize metrics, status highlights, and calls to action without degrading legibility.
- **Clarity & Utility:** High contrast ratios (WCAG AAA for text), generous input heights, and standardized badge matrices suited for high-density academic-to-workplace data flows.

## Colors

The color palette centers on FET's official institutional green, anchored by robust slate neutrals and energized by vibrant functional accents:

- **Primary (`#1b5e20` - FET Forest Deep):** Used for global institutional app bars, prominent action headers, key primary buttons, and navigational focus states.
- **Secondary (`#2e7d32` - Academic Mid-Green):** Used for secondary interactive controls, table headers, hovered states, and icon accents.
- **Tertiary (`#10b981` - Emerald Growth) & Lime Accent (`#84cc16`):** Reserved for positive badges, progress indicators, active vacancy states, and quick-highlight metrics.
- **Neutral Surface Canvas (`#f8fafc` - Slate 50) & Surface Cards (`#ffffff`):** Deliver a clean background with border tones mapped to `#e2e8f0` (Slate 200) and text hierarchy anchored on `#0f172a` (Slate 900) down to `#64748b` (Slate 500).
- **Status Alerts:**
  - Success/Approved: `#16a34a` (Emerald 600) / Background `#ecfdf5`
  - In Review/Pending: `#d97706` (Amber 600) / Background `#fffbeb`
  - Rejected/Closed: `#dc2626` (Red 600) / Background `#fef2f2`
  - Internship/Pasantía Badge: `#0284c7` (Sky 600) / Background `#f0f9ff`

## Typography

The design system relies on **Inter** across all typographical scales to guarantee universal legibility across technical tables, candidate curricula, job specifications, and institutional notices.

- **Headlines:** Dense tracking with negative letter spacing (`-0.02em` on `headline-xl`) keeps university portal headings structured and authoritative without consuming excessive vertical view height.
- **Data & Tables:** Body styles (`body-md`, `body-sm`) are tuned to numeric tabular displays, student code identifiers, and employer verification statuses.
- **Labels & Tags:** Uppercase or high-contrast semibold weights (`label-md`, `label-sm`) deliver immediate visual parsing for application phases (Postulado, En Selección, Contratado, Finalizado).

## Layout & Spacing

The layout model implements a 12-column responsive fluid grid with a strict institutional max-width boundary of `1280px`:

- **Desktop (1024px+):** 12-column grid, 24px gutters, and 32px outer safe margins. Sidebars for filters (vacancies, modalities, degree programs) span 3 columns, and central vacancy feeds span 9 columns.
- **Tablet (768px - 1023px):** 8-column layout, 16px gutters, and 24px margins. Filters collapse into a slide-over drawer or compact top-bar row.
- **Mobile (<768px):** 4-column layout, 16px margins, edge-to-edge listing cards with sticky header actions for quick job search and CV download.

The top institutional bar remains pinned or anchored at `64px` height, retaining parity with existing campus systems (Q10 single-sign-on integration) while providing direct breadcrumb cues.

## Elevation & Depth

This design system favors **low-contrast outlines** complemented by **subtle ambient shadows**, maintaining an uncluttered, academic portal look that avoids visual fatigue during long evaluation sessions:

- **Surface Base (Level 0):** Neutral `#f8fafc` background with crisp `1px` structural borders (`#e2e8f0`).
- **Cards & Data Modules (Level 1):** White `#ffffff` background with `1px solid #e2e8f0` and an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Active Card & Hover States (Level 2):** Elevated shadow: `0 4px 6px -1px rgba(27, 94, 32, 0.08), 0 2px 4px -2px rgba(27, 94, 32, 0.06)`, with border transitioning to `#2e7d32`.
- **Modals & Drawers (Level 3):** Clean drop-shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, accompanied by a deep `#0f172a` backdrop overlay set at 50% opacity.

## Shapes

The roundedness token is set to **Level 1 (Soft)**:
- Standard buttons, form fields, and dropdown targets use `0.25rem` (4px) to `0.375rem` (6px) corner radii, upholding institutional authority and aligned data tables.
- Card containers, dialog surfaces, and modal sheets scale to `0.5rem` (8px).
- Badges and micro-status tags adopt `0.25rem` or full pill shape (`9999px`) solely when displaying numeric notification tallies or candidate match percentages.

## Components

### Buttons
- **Primary Institutional Button:** Background `#1b5e20`, label text `#ffffff`, border radius `6px`, padding `10px 18px`, font weight `600`. Hover state deepens to `#144618`.
- **Secondary / Action Button:** Background `#2e7d32`, label `#ffffff`. Suitable for secondary workflows like "Descargar Hoja de vida" or "Postularse".
- **Outline Button:** Transparent background, `1.5px solid #cbd5e1`, text `#334155`. Hover background `#f1f5f9`.
- **Danger / Revoke:** Outline with `#ef4444` border and text for withdrawing applications.

### Chips & Badges
- **Status Badges:** Compact height (`22px`), `label-sm`, padding `2px 8px`, border radius `4px`.
  - *Abierta / Convocatoria:* Background `#ecfdf5`, text `#166534`, border `1px solid #bbf7d0`.
  - *Pasantía / Práctica:* Background `#eff6ff`, text `#1d4ed8`, border `1px solid #bfdbfe`.
  - *Cerrada:* Background `#f8fafc`, text `#64748b`, border `1px solid #e2e8f0`.

### Form Inputs & Search Fields
- Integrated search bar with leading academic category select and trailing search trigger.
- Input box: background `#ffffff`, border `1px solid #cbd5e1`, height `42px`, padding `8px 12px`, typography `body-md`. Focus ring: `2px solid #2e7d32` with an offset of `1px`.

### Empty States & Feed Cards
- **Empty State Card:** Clean `#ffffff` canvas with dashed border `1.5px solid #cbd5e1`, centering an institutional icon, title in `headline-sm` (`#1e293b`), and subtitle in `body-sm` (`#64748b`), accompanied by a clear CTA to update occupational profile.
- **Vacancy Listing Card:** Structured three-zone card: top row with enterprise logo, title, and program tags; middle row with stipend, location (Neiva / Huila / Remoto), and vacancy duration; footer row with application status indicator and direct action buttons.

### Institutional Header & Q10 Anchor Bar
- Pinned `#1b5e20` top navbar with high-contrast white navigational links, institutional seal placement, integrated badge notification counter (`#dc2626`), and user identity dropdown (e.g., student name and institutional code).