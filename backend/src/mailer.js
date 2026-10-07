import nodemailer from 'nodemailer'

const mode =
  process.env.MAIL_TRANSPORT ||
  (process.env.SMTP_HOST ? 'smtp' : 'unconfigured')

let transporter = null

if (mode === 'smtp') {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })
}

export function mailMode() {
  return mode
}

function formatBody(value) {
  return Object.entries(value)
    .filter(([, v]) => v)
    .map(([key, v]) => `${key}: ${v}`)
    .join('\n')
}

/**
 * Send a form notification. Throws a clear error when email is not configured
 * so the API can return an honest failure instead of pretending to succeed.
 */
export async function sendNotification(kind, value) {
  const to = process.env.MAIL_TO
  const from = process.env.MAIL_FROM || process.env.SMTP_USER

  if (!to || !from) {
    throw new Error('Email is not configured (set MAIL_TO and MAIL_FROM).')
  }

  const subject =
    kind === 'contact'
      ? `Contact message: ${value.subject}`
      : `Project inquiry: ${value.businessName}`

  const text = formatBody(value)

  if (mode === 'console') {
    console.log(`[mail:console] to=${to} from=${from} subject=${subject}`)
    console.log(text)
    return
  }

  if (mode !== 'smtp' || !transporter) {
    throw new Error(
      'Email is not configured (set SMTP_HOST or a valid MAIL_TRANSPORT).',
    )
  }

  await transporter.sendMail({ from, to, subject, text })
}
