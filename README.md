# ANARA Technologies — Website

Corporate portfolio and lead-generation website for **ANARA Technologies**.

Sources of truth (read these before changing content):

- `AGENTS.md` — how work is executed, reported, and reviewed.
- `Files/ANARA_Website_PRD_v1.md` — approved product requirements and content.
- `Files/ANARA_Website_Modular_Build_Checklist.md` — build order and module status.

## Structure

```
frontend/            React + Vite + Tailwind single-page site
backend/             Minimal Express API for form submissions
tests/browser/       Dependency-free headless browser checks (Chrome/Edge CDP)
.kilo/               Worker orchestration tooling (see .kilo/orchestration/ORCHESTRATION.md)
```

All V1 routes are wired in `frontend/src/App.jsx`: `/`, `/systems`, `/plantwais`,
`/services`, `/about`, `/contact`, `/start-a-project`, plus a styled 404.

## Prerequisites

- Node.js 20+ and npm 10+ (developed on Node 24).
- Google Chrome or Microsoft Edge (only for the browser checks).

## Install

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Develop

```bash
cd frontend && npm run dev     # http://localhost:5173 (proxies /api to :3001)
cd backend  && npm run dev     # http://localhost:3001
```

## Environment

Copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to
`backend/.env`, then fill in values. Never commit real secrets; only `VITE_*`
variables reach the browser, so keep private keys server-side. `MAIL_TRANSPORT=console`
is available for local form testing without sending email.

## Test

```bash
cd backend  && npm test                      # validation, CAPTCHA logic, HTTP endpoints (console mail)
cd frontend && npm test                      # analytics instrumentation
node tests/browser/verify.mjs                # routes, copy, responsive, a11y, nav, form states
```

Browser checks accept `CHROME_PATH` to select Chrome or Edge. They never contact
Google Analytics, reCAPTCHA, or SMTP.

## Build

```bash
cd frontend && npm run build && npm run lint
```

## Launch handoff (not yet done)

Local implementation and credential-free verification are complete. These checks
still require external accounts, credentials, a domain, or deployment:

- Real email delivery: set `MAIL_TO`, `MAIL_FROM`, and SMTP credentials
  (`backend/.env`) and verify a real inbox receives both form notifications.
- reCAPTCHA: provide `VITE_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET`, then verify
  a real token and a real rejection in the browser.
- Analytics: provide `VITE_GA_MEASUREMENT_ID` and confirm live event receipt.
- Domain/SEO: replace `REPLACE-WITH-YOUR-DOMAIN` in `frontend/public/sitemap.xml`
  and `frontend/public/robots.txt`, and set `VITE_SITE_URL`.
- Cross-browser: verify Firefox and Safari (not available in this environment).
- Deployment: host the frontend (e.g., Vercel) and the API, enable HTTPS, and run
  the production form/CAPTCHA/analytics checks.
