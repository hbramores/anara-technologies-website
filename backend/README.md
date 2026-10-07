# ANARA Website — Forms API

Minimal Express API that receives the website's Contact and Start a Project
submissions, validates them server-side, verifies reCAPTCHA, rate-limits
abuse, and sends notification email.

## Requirements

- Node.js 20+ (developed on Node 24)

## Setup

```bash
npm install
cp .env.example .env
npm run dev     # http://localhost:3001
npm start       # production
```

## Environment variables

See `.env.example`. Nothing here is committed; all credentials live in `.env`.

| Variable            | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `PORT`              | Port to listen on (default `3001`)                   |
| `ALLOWED_ORIGIN`    | Comma-separated browser origins allowed via CORS     |
| `MAIL_FROM`         | From address for notifications                       |
| `MAIL_TO`           | Where ANARA receives notifications                   |
| `SMTP_HOST/PORT/SECURE/USER/PASS` | Transactional SMTP credentials         |
| `MAIL_TRANSPORT`    | `console` for local testing only; otherwise SMTP     |
| `RECAPTCHA_SECRET`  | Google reCAPTCHA v2 secret (server verification)     |

## Endpoints

- `GET /api/health` — health check.
- `POST /api/contact` — Contact form.
- `POST /api/project` — Start a Project inquiry.

Both POST endpoints accept JSON, validate input, verify the CAPTCHA token
(when `RECAPTCHA_SECRET` is set), and return `{ ok: true }` or a JSON error.

## Security notes

- Request bodies are limited to 100kb.
- Rate limiting: 20 requests per 15 minutes per IP on `/api`.
- No secrets are returned to the client; errors are generic.
- `MAIL_TRANSPORT=console` logs submission content and must not be used in
  production.
