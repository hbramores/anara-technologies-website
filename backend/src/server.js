import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { verifyCaptcha } from './captcha.js'
import { mailMode, sendNotification } from './mailer.js'
import { validateContact, validateProject } from './validate.js'

const app = express()
const port = Number(process.env.PORT || 3001)

const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))
app.use(cors({ origin: allowedOrigins }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many submissions. Please try again later.',
  },
})
app.use('/api', limiter)

app.get('/api/health', (request, response) => {
  response.json({ ok: true, mail: mailMode() })
})

function submissionHandler(kind, validate) {
  return async (request, response) => {
    try {
      const { value, errors } = validate(request.body ?? {})

      if (Object.keys(errors).length > 0) {
        return response.status(400).json({
          ok: false,
          message: 'Please check the highlighted fields.',
          errors,
        })
      }

      const captcha = await verifyCaptcha(
        request.body?.captchaToken,
        request.ip,
      )
      if (!captcha.ok) {
        return response.status(400).json({ ok: false, message: captcha.message })
      }

      await sendNotification(kind, value)
      return response.json({ ok: true })
    } catch (error) {
      // Log the reason without echoing submitted content into logs.
      console.error(`[${kind}] submission failed: ${error.message}`)
      return response.status(500).json({
        ok: false,
        message:
          'We could not send your message right now. Please try again later.',
      })
    }
  }
}

app.post('/api/contact', submissionHandler('contact', validateContact))
app.post('/api/project', submissionHandler('project', validateProject))

app.use((request, response) => {
  response.status(404).json({ ok: false, message: 'Not found.' })
})

app.listen(port, () => {
  console.log(`ANARA forms API listening on http://localhost:${port}`)
  if (mailMode() === 'unconfigured') {
    console.warn(
      'Email is not configured. Set SMTP_* (or MAIL_TRANSPORT=console for local testing).',
    )
  }
})
