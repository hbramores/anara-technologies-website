import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  analyticsConfigured,
  trackEvent,
  trackPageView,
} from '../src/lib/analytics.js'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')

let calls

beforeEach(() => {
  calls = []
  globalThis.window = { gtag: (...args) => calls.push(args) }
})

afterEach(() => {
  delete globalThis.window
})

test('trackEvent forwards the event name and params to gtag', () => {
  trackEvent('custom_event', { a: 1 })
  assert.deepEqual(calls, [['event', 'custom_event', { a: 1 }]])
})

test('trackPageView emits page_view with the current path', () => {
  trackPageView('/about')
  assert.deepEqual(calls, [['event', 'page_view', { page_path: '/about' }]])
})

test('trackEvent is a safe no-op when gtag is unavailable', () => {
  globalThis.window = {}
  assert.doesNotThrow(() => trackEvent('ignored'))
  assert.deepEqual(calls, [])
})

test('analyticsConfigured is false without a measurement ID', () => {
  assert.equal(analyticsConfigured(), false)
})

const wiring = [
  [
    'components/system/AnalyticsTracker.jsx',
    ['plantwais_view', 'start_a_project_click', 'trackPageView'],
  ],
  ['components/forms/ContactForm.jsx', ['contact_submitted']],
  ['components/forms/ProjectForm.jsx', ['project_inquiry_submitted']],
]

for (const [file, tokens] of wiring) {
  test(`wiring: ${file} references its documented analytics calls`, () => {
    const source = readFileSync(path.join(srcDir, file), 'utf8')
    for (const token of tokens) {
      assert.ok(source.includes(token), `${file} is missing "${token}"`)
    }
  })
}
