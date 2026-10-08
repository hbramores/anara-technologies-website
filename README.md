# ANARA Technologies — Website (Frontend)

Corporate portfolio and lead-generation website for **ANARA Technologies**.

The form API lives in a separate repository:
**https://github.com/hbramores/anara-technologies-backend**. This repository
contains only the frontend application plus project governance.

Sources of truth (read these before changing content):

- `AGENTS.md` — how work must be executed and reported.
- `Files/ANARA_Website_PRD_v1.md` — approved product requirements and content.
- `Files/ANARA_Website_Modular_Build_Checklist.md` — build order and module status.

## Tech Stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- [React Router](https://reactrouter.com/) 7
- [Oxlint](https://oxc.rs/) for linting

## Requirements

- Node.js 20+ (developed on Node 24)
- npm 10+
- Google Chrome or Microsoft Edge (only for the browser checks)

## Getting Started

```bash
npm install
npm run dev
```

The development server runs at http://localhost:5173 by default and proxies
`/api` to http://localhost:3001 (a locally running copy of the backend repo).

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed. Only variables
prefixed with `VITE_` are exposed to the browser; never place private keys or
credentials in a `VITE_` variable. `.env` is git-ignored.

| Variable                 | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `VITE_SITE_URL`          | Public site URL for canonical/OG metadata            |
| `VITE_API_BASE_URL`      | Form API origin (empty = same origin / dev proxy)    |
| `VITE_RECAPTCHA_SITE_KEY`| Google reCAPTCHA v2 site key (public)                |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (public)           |
| `VITE_OG_IMAGE_URL`      | Social sharing image URL (optional)                  |

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start the Vite development server      |
| `npm run build`     | Create a production build in `dist/`   |
| `npm run preview`   | Preview the production build locally   |
| `npm run lint`      | Run Oxlint                             |
| `npm test`          | Run the frontend unit tests            |

## Tests

```bash
npm test                                  # analytics instrumentation (node --test)
node tests/browser/verify.mjs             # headless Chrome/Edge checks (routes, copy,
                                          # responsive, a11y, nav, form states)
BROWSER_TARGET=preview node tests/browser/verify.mjs   # same checks against dist/
```

The browser harness starts its own Vite server, drives a real headless browser
via the DevTools Protocol, and never contacts Google Analytics, reCAPTCHA, or
SMTP. Set `CHROME_PATH` to choose Chrome or Edge.

## Routes

| Path                | Page            |
| ------------------- | --------------- |
| `/`                 | Home            |
| `/systems`          | Systems         |
| `/plantwais`        | PLANTWAIS       |
| `/services`         | Services        |
| `/about`            | About           |
| `/contact`          | Contact         |
| `/start-a-project`  | Start a Project |

Unknown paths resolve to a styled not-found page.

## Project Structure

```text
.
├── public/               # favicon, robots.txt, sitemap.xml
├── src/
│   ├── assets/           # imported assets
│   ├── components/       # forms, home, layout, plantwais, system, ui
│   ├── lib/              # cn, navigation, seo, analytics, api
│   ├── pages/            # route-level page components
│   ├── App.jsx           # route configuration
│   ├── index.css         # design tokens / global styles / Tailwind entry
│   └── main.jsx          # application entry point
├── test/                 # frontend unit tests (node --test)
├── tests/browser/        # dependency-free headless browser checks
├── Files/                # PRD and build checklist
├── .kilo/                # worker orchestration tooling
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Design System

Design tokens live in `src/index.css` (Tailwind CSS v4 `@theme`); reusable
primitives live in `src/components/ui/`. Brand colors are the `magenta` scale
(`magenta-500 #EB347C`, `magenta-700 #B0004B`, `magenta-900 #670022`) with the
gradient `#670022 → #B0004B → #EB347C` exposed as `bg-anara-gradient`. Footer
content is limited to PRD-approved information; contact email, social links,
and legal details are intentionally omitted until officially provided.

## Forms API

Form submissions are delivered by the separate backend repository. `src/lib/api.js`
posts JSON to `/api/contact` and `/api/project`; during development
`vite.config.js` proxies `/api` to `http://localhost:3001`. In production set
`VITE_API_BASE_URL` to the deployed API origin.

## Worker Orchestration

Real Kilo Code worker orchestration is preserved under `.kilo/orchestration/`.
See `.kilo/orchestration/ORCHESTRATION.md` and the `## Worker Orchestration`
section of `AGENTS.md`.

## Build & Deploy

- `npm run build` outputs `dist/`.
- Deploy `dist/` to a static host (for example Vercel); `vercel.json` rewrites
  all routes to `index.html`.
- Set the frontend variables above at build time.

## Launch handoff (not yet done)

Local implementation and credential-free verification are complete. Pending
items require external accounts, credentials, a domain, or hosting:

- Real email delivery — verified against the backend repo's `console` transport
  only; a live inbox test needs SMTP credentials.
- reCAPTCHA and Analytics — inactive until `VITE_RECAPTCHA_SITE_KEY` /
  `VITE_GA_MEASUREMENT_ID` (and the backend `RECAPTCHA_SECRET`) are set.
- Replace `REPLACE-WITH-YOUR-DOMAIN` in `public/sitemap.xml` and
  `public/robots.txt`, and set `VITE_SITE_URL`.
- Firefox/Safari verification (not available in the build environment).
- Deployment and production checks (HTTPS, live forms/CAPTCHA/analytics).
