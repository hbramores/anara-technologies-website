# ANARA Technologies — Website (Frontend)

Corporate portfolio and lead-generation website for **ANARA Technologies**.

This repository is built one verified module at a time. See the project
sources of truth:

- `../files/ANARA_Website_PRD_v1.md` — product requirements and approved content
- `../files/ANARA_Website_Modular_Build_Checklist.md` — module build order
- `../AGENTS.md` — how work must be executed and reported

## Tech Stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- [React Router](https://reactrouter.com/) 7
- [Oxlint](https://oxc.rs/) for linting

## Requirements

- Node.js 20+ (developed on Node 24)
- npm 10+

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The development server runs at http://localhost:5173 by default.

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed:

```bash
cp .env.example .env
```

Only variables prefixed with `VITE_` are exposed to the browser. Never place
private keys or credentials in a `VITE_` variable. `.env` is git-ignored.

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite development server  |
| `npm run build`   | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run Oxlint                          |

## Routes

All V1 pages are implemented.

| Path                | Page            |
| ------------------- | --------------- |
| `/`                 | Home            |
| `/systems`          | Systems         |
| `/plantwais`        | PLANTWAIS       |
| `/services`         | Services        |
| `/about`            | About           |
| `/contact`          | Contact         |
| `/start-a-project`  | Start a Project |

Unknown paths resolve to a not-found page.

## Homepage

Homepage sections live in `src/components/home/` and are composed by
`src/pages/HomePage.jsx`. Built so far:

- `Hero` (B01) — approved brand line, headline, supporting copy, and the
  `Start a Project` / `Explore Our Systems` CTAs, with an abstract
  brand-gradient visual (no product imagery or invented claims).
- `WhatAnaraDoes` (B02) — heading, approved copy, and the three-step
  Understand → Approach → Build flow.
- `FeaturedPlantwais` (B03) — strategic dark section with PLANTWAIS info,
  `In Development` status, `Explore PLANTWAIS` CTA, and a placeholder area
  for the future approved product screenshot (no fabricated interface).
- `ServicesPreview` (B04) — heading, the four approved services, and the
  problem-first message with a `Start a Project` CTA.
- `HowWeWork` (B05) — the four-step Understand → Plan → Build →
  Launch & Improve process.
- `AboutPreview` (B06) — ANARA meaning, introduction, philosophy, and the
  `Learn About ANARA` CTA.
- `FinalCta` (B07) — closing deep-magenta CTA section with the
  `Start a Project` conversion action.

Phase B (homepage) is complete. Later phases add the Systems/PLANTWAIS,
Services, About, Contact, and Start a Project pages.

## Global Layout

The shared shell lives in `src/components/layout/` and wraps every route via a
layout route in `src/App.jsx`:

- `RootLayout` — skip link, sticky `Header`, `<main id="main-content">`
  (the single main landmark), and `Footer`.
- `Header` — desktop nav, mobile menu, and the `Start a Project` primary CTA.
- `Footer` — brand, description, location, explore/systems links, and CTA.

Navigation destinations come from `src/lib/navigation.js` (single source of
truth shared by the header and footer). `NavLink` supplies active states
(`aria-current="page"` plus a magenta indicator that is not color-only). The
mobile menu is keyboard accessible: `aria-expanded`/`aria-controls` on the
toggle, closes on route change and on `Escape`.

Footer content is limited to PRD-approved information; contact email, social
links, and legal details are intentionally omitted until officially provided.

## Design System

Design tokens live in `src/index.css` (Tailwind CSS v4 `@theme`). Reusable
visual primitives live in `src/components/ui/`.

### Brand colors

The official ANARA colors are the 500/700/900 steps of the `magenta` scale:

| Token          | Hex       | Role                         |
| -------------- | --------- | ---------------------------- |
| `magenta-500`  | `#EB347C` | Bright Magenta (accent)      |
| `magenta-700`  | `#B0004B` | ANARA Magenta (primary action) |
| `magenta-900`  | `#670022` | Deep Magenta                 |

Semantic neutrals: `ink`, `ink-muted`, `canvas`, `surface`, `surface-muted`,
`line`. The brand gradient `#670022 → #B0004B → #EB347C` is available as the
`bg-anara-gradient` utility.

Contrast (WCAG 2.1) for primary pairings was verified: white on `#B0004B`
is 7.1:1 and white on `#670022` is 13.1:1 (both AA/AAA). Bright Magenta
`#EB347C` is 3.95:1 with white, so it is reserved for large text and
decoration, not body copy or buttons.

### Typography

`Plus Jakarta Sans` (Google Fonts) is the single system family
(`font-sans`/`font-display`). Display steps are `text-display` and
`text-title`; body copy uses Tailwind's default text scale.

### Primitives

| Component   | Purpose                                                    |
| ----------- | ---------------------------------------------------------- |
| `Container` | Centered, width-constrained wrapper (`narrow`/`default`/`wide`) |
| `Section`   | Vertical section rhythm with `light`/`muted`/`dark`/`brand` tones |
| `Button`    | Variants `primary`/`secondary`/`ghost`/`dark`/`link`; renders button, router `Link`, or `<a>` |
| `Card`      | Rounded surface with `default`/`muted`/`brand`/`dark` tones |
| `FieldShell`, `Input`, `Textarea`, `Select` | Form controls with label, hint, error and ARIA wiring |

## Project Structure

```text
frontend/
├── public/               # favicon, robots.txt, sitemap.xml
├── src/
│   ├── assets/           # imported assets
│   ├── components/
│   │   ├── forms/        # ContactForm, ProjectForm, Captcha
│   │   ├── home/         # homepage sections (B01–B07)
│   │   ├── layout/       # RootLayout, Header, Footer, Logo
│   │   ├── plantwais/    # PLANTWAIS page sections
│   │   ├── system/       # SeoManager, AnalyticsTracker
│   │   └── ui/           # reusable design-system primitives
│   ├── lib/              # helpers (cn), navigation, seo, analytics, api
│   ├── pages/            # route-level page components
│   ├── App.jsx           # route configuration
│   ├── index.css         # design tokens / global styles / Tailwind entry
│   └── main.jsx          # application entry point
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Forms API

Form submissions are delivered by the small Express API in `../backend`.

- Frontend: `src/lib/api.js` posts JSON to `/api/contact` and `/api/project`.
  During development, `vite.config.js` proxies `/api` to `http://localhost:3001`.
  In production, set `VITE_API_BASE_URL` to the deployed API origin.
- Backend: `../backend` validates input server-side, verifies the reCAPTCHA
  token, applies rate limiting, and sends a notification email.

Run it locally:

```bash
cd ../backend
npm install
cp .env.example .env   # fill in values
npm run dev            # http://localhost:3001
```

## Production & Deployment

- Build the frontend with `npm run build` (output in `dist/`).
- Deploy `dist/` to a static host (for example Vercel). `vercel.json` rewrites
  all routes to `index.html` so client-side routing works.
- Set these frontend variables at build time: `VITE_SITE_URL`,
  `VITE_API_BASE_URL`, `VITE_RECAPTCHA_SITE_KEY`, `VITE_GA_MEASUREMENT_ID`.
- Deploy `../backend` separately (for example Render/Railway/Fly) and set its
  environment variables from `../backend/.env.example`.
- Replace `REPLACE-WITH-YOUR-DOMAIN` in `public/robots.txt` and
  `public/sitemap.xml` with the production domain.

The site runs without the optional secrets: reCAPTCHA and Analytics are
inactive until their keys are provided, and form submissions return a clear
error until the API and email are configured.
