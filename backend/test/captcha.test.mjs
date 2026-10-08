import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { verifyCaptcha } from '../src/captcha.js'

const originalSecret = process.env.RECAPTCHA_SECRET
const originalFetch = globalThis.fetch

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.RECAPTCHA_SECRET
  } else {
    process.env.RECAPTCHA_SECRET = originalSecret
  }
  globalThis.fetch = originalFetch
})

test('skips verification when RECAPTCHA_SECRET is not configured', async () => {
  delete process.env.RECAPTCHA_SECRET
  const result = await verifyCaptcha(undefined, '127.0.0.1')
  assert.deepEqual(result, { ok: true, skipped: true })
})

test('rejects a missing token when a secret is configured', async () => {
  process.env.RECAPTCHA_SECRET = 'test-secret'
  const result = await verifyCaptcha('', '127.0.0.1')
  assert.equal(result.ok, false)
  assert.match(result.message, /CAPTCHA/)
})

test('calls the official siteverify endpoint and accepts success', async () => {
  process.env.RECAPTCHA_SECRET = 'test-secret'
  let requestedUrl = ''
  globalThis.fetch = async (url) => {
    requestedUrl = String(url)
    return { json: async () => ({ success: true }) }
  }
  const result = await verifyCaptcha('token', '127.0.0.1')
  assert.equal(result.ok, true)
  assert.match(requestedUrl, /recaptcha\/api\/siteverify/)
})

test('rejects a token when reCAPTCHA reports failure', async () => {
  process.env.RECAPTCHA_SECRET = 'test-secret'
  globalThis.fetch = async () => ({ json: async () => ({ success: false }) })
  const result = await verifyCaptcha('token', '127.0.0.1')
  assert.equal(result.ok, false)
  assert.match(result.message, /verification failed/i)
})

test('reports a verification error without leaking details', async () => {
  process.env.RECAPTCHA_SECRET = 'test-secret'
  globalThis.fetch = async () => {
    throw new Error('network down')
  }
  const result = await verifyCaptcha('token', '127.0.0.1')
  assert.equal(result.ok, false)
  assert.match(result.message, /could not verify/i)
  assert.doesNotMatch(result.message, /network down/)
})
