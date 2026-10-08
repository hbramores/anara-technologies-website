import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import { after, before, test } from 'node:test'
import { fileURLToPath } from 'node:url'

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

let child
let baseUrl
let childExited = false
let stdout = ''
let stderr = ''

function waitForListening(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()
    const poll = () => {
      if (childExited) {
        reject(new Error(`server exited before listening. stderr: ${stderr}`))
        return
      }
      if (/listening on/.test(stdout)) {
        resolve()
        return
      }
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`timed out waiting for server. stderr: ${stderr}`))
        return
      }
      setTimeout(poll, 100)
    }
    poll()
  })
}

async function post(pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  return { status: response.status, data }
}

before(async () => {
  const port = await freePort()
  baseUrl = `http://127.0.0.1:${port}`
  child = spawn(process.execPath, ['src/server.js'], {
    cwd: backendDir,
    env: {
      ...process.env,
      PORT: String(port),
      ALLOWED_ORIGIN: 'http://localhost:5173',
      MAIL_TRANSPORT: 'console',
      MAIL_TO: 'inbox@example.test',
      MAIL_FROM: 'no-reply@example.test',
      SMTP_HOST: '',
      SMTP_USER: '',
      SMTP_PASS: '',
      RECAPTCHA_SECRET: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', (chunk) => {
    stdout += chunk.toString()
  })
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  child.once('exit', () => {
    childExited = true
  })
  await waitForListening()
})

after(async () => {
  if (!child || childExited) return
  child.kill()
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 5000)
    child.once('exit', () => {
      clearTimeout(timer)
      resolve()
    })
  })
})

test('health reports the active mail mode (console for tests)', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  assert.equal(response.status, 200)
  const data = await response.json()
  assert.equal(data.ok, true)
  assert.equal(data.mail, 'console')
})

test('contact submission returns ok and produces a console notification', async () => {
  const before = stdout.length
  const { status, data } = await post('/api/contact', {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    business: 'Acme',
    subject: 'Hello ANARA',
    message: 'Please help with our process.',
  })
  assert.equal(status, 200)
  assert.deepEqual(data, { ok: true })

  const log = stdout.slice(before)
  assert.match(log, /\[mail:console\]/)
  assert.match(log, /Contact message: Hello ANARA/)
  assert.match(log, /Please help with our process\./)
})

test('project submission returns ok and produces a console notification', async () => {
  const before = stdout.length
  const { status, data } = await post('/api/project', {
    fullName: 'Juan Dela Cruz',
    email: 'juan@example.com',
    contactNumber: '09171234567',
    businessName: 'Acme Farm',
    businessType: 'Agriculture',
    businessDescription: 'We grow rice.',
    currentProcess: 'Paper records.',
    problem: 'Records are disorganized.',
    desiredOutcome: 'A simple management system.',
    budget: '₱20,000–₱50,000',
    timeline: '1–3 months',
    additionalInfo: 'Available on weekdays.',
  })
  assert.equal(status, 200)
  assert.deepEqual(data, { ok: true })

  const log = stdout.slice(before)
  assert.match(log, /\[mail:console\]/)
  assert.match(log, /Project inquiry: Acme Farm/)
  assert.match(log, /A simple management system\./)
})

test('invalid contact submission is rejected and sends no notification', async () => {
  const before = stdout.length
  const { status, data } = await post('/api/contact', {})
  assert.equal(status, 400)
  assert.equal(data.ok, false)
  assert.equal(data.message, 'Please check the highlighted fields.')
  assert.ok(data.errors.fullName)
  assert.ok(data.errors.email)
  assert.doesNotMatch(stdout.slice(before), /\[mail:console\]/)
})

test('invalid project submission is rejected and sends no notification', async () => {
  const before = stdout.length
  const { status, data } = await post('/api/project', { fullName: 'Jane' })
  assert.equal(status, 400)
  assert.equal(data.ok, false)
  assert.ok(data.errors.email)
  assert.ok(data.errors.businessName)
  assert.doesNotMatch(stdout.slice(before), /\[mail:console\]/)
})

test('unknown routes return the documented 404 payload', async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`)
  assert.equal(response.status, 404)
  const data = await response.json()
  assert.deepEqual(data, { ok: false, message: 'Not found.' })
})
