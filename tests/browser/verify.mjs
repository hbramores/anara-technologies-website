import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import {
  connect,
  evaluate,
  findBrowser,
  findPageTarget,
  waitForHttp,
  waitForPage,
} from './chrome.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../..')
const frontend = path.join(repo, 'frontend')

const results = []
function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`)
}

function freePort() {
  return 4600 + Math.floor(Math.random() * 900)
}

const routes = [
  { path: '/', expect: 'From business problems to working systems' },
  { path: '/systems', expect: 'PLANTWAIS' },
  { path: '/plantwais', expect: 'Plan before you plant' },
  { path: '/services', expect: 'Digital systems built around your business' },
  { path: '/about', expect: 'A New Approach to Real-world Advancement' },
  { path: '/contact', expect: 'talk.' },
  { path: '/start-a-project', expect: 'problem' },
]

const NAV_ROUTES = [
  '/',
  '/systems',
  '/plantwais',
  '/services',
  '/about',
  '/contact',
  '/start-a-project',
]

let vite
let chrome
let client
let userDataDir

try {
  const browserExe = findBrowser()
  if (!browserExe) throw new Error('No Chrome/Edge browser found')
  console.log(`Browser: ${browserExe}`)

  const appPort = freePort()
  let cdpPort = freePort()
  while (cdpPort === appPort) cdpPort = freePort()
  const base = `http://127.0.0.1:${appPort}`

  const previewMode = process.env.BROWSER_TARGET === 'preview'
  console.log(`Target: ${previewMode ? 'production build (vite preview)' : 'dev server'}`)
  vite = spawn(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      ...(previewMode ? ['preview'] : []),
      '--port',
      String(appPort),
      '--strictPort',
      '--host',
      '127.0.0.1',
    ],
    { cwd: frontend, stdio: ['ignore', 'pipe', 'pipe'] },
  )
  await waitForHttp(base)

  userDataDir = mkdtempSync(path.join(tmpdir(), 'anara-chrome-'))
  chrome = spawn(
    browserExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1366,900',
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${cdpPort}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  )
  await waitForHttp(`http://127.0.0.1:${cdpPort}/json/version`)
  const wsUrl = await findPageTarget(cdpPort)
  client = await connect(wsUrl)
  await client.send('Page.enable')
  await client.send('Runtime.enable')

  async function setViewport(width, height = 900) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    })
  }

  async function goto(pathname) {
    const loaded = client.once('Page.loadEventFired')
    await client.send('Page.navigate', { url: `${base}${pathname}` })
    await Promise.race([loaded, delay(6000)])
    await waitForPage(client, "document.querySelector('h1')", {
      timeoutMs: 8000,
    })
  }

  const probe = `(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
    const controls = Array.from(document.querySelectorAll('input,textarea,select'))
    const unlabeled = controls.filter((c) => {
      if (c.type === 'hidden') return false
      if (c.getAttribute('aria-label') || c.getAttribute('aria-labelledby')) return false
      if (c.id && document.querySelector('label[for="' + CSS.escape(c.id) + '"]')) return false
      if (c.closest('label')) return false
      return true
    }).length
    return {
      title: document.title,
      lang: document.documentElement.getAttribute('lang'),
      viewport: Boolean(document.querySelector('meta[name="viewport"]')),
      h1: document.querySelectorAll('h1').length,
      h1Text: (document.querySelector('h1') || {}).textContent || '',
      main: document.querySelectorAll('main').length,
      nav: document.querySelectorAll('nav').length,
      skipLink: Boolean(document.querySelector('a[href="#main-content"]')),
      imgsNoAlt: imgs.filter((i) => !i.hasAttribute('alt')).length,
      unlabeled,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      bodyText: document.body.innerText,
    }
  })()`

  // Routes: presence, copy, structure, a11y basics, no horizontal overflow.
  const titles = new Set()
  for (const route of routes) {
    let info = null
    try {
      await setViewport(1366)
      await goto(route.path)
      info = await evaluate(client, probe)
      record(`route ${route.path}: renders h1`, info.h1 >= 1)
      record(`route ${route.path}: single main landmark`, info.main === 1)
      record(`route ${route.path}: has title + lang + viewport`, Boolean(info.title && info.lang && info.viewport))
      record(`route ${route.path}: has skip link`, info.skipLink)
      record(`route ${route.path}: every image has alt`, info.imgsNoAlt === 0)
      record(`route ${route.path}: every form control labelled`, info.unlabeled === 0)
      record(`route ${route.path}: approved copy present`, info.bodyText.includes(route.expect))
      titles.add(info.title)

      for (const width of [375, 768, 1366]) {
        await setViewport(width)
        await delay(200)
        const metrics = await evaluate(client, probe)
        record(
          `route ${route.path}: no horizontal overflow @ ${width}px`,
          metrics.overflow <= 1,
          `overflow=${metrics.overflow}`,
        )
      }
    } catch (error) {
      record(`route ${route.path}: browser check`, false, error.message)
    }
  }
  record('SEO: page titles are unique', titles.size === routes.length, `unique=${titles.size}/${routes.length}`)

  // Navigation: links exist and client-side routing works.
  await setViewport(1366)
  await goto('/')
  const hrefs = await evaluate(
    client,
    "Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))",
  )
  for (const route of NAV_ROUTES) {
    record(`nav: link to ${route} exists`, hrefs.includes(route))
  }
  await evaluate(
    client,
    "document.querySelector('header nav a[href=\"/services\"]').click(); true",
  )
  const navigated = await waitForPage(
    client,
    "location.pathname === '/services'",
  )
  record('nav: header link navigates client-side', navigated)

  // 404 route.
  await setViewport(375)
  await goto('/this-route-does-not-exist')
  const notFound = await evaluate(
    client,
    "document.body.innerText.includes('Page Not Found')",
  )
  record('404: unknown route renders Page Not Found', notFound)
  const notFoundInset = await evaluate(
    client,
    "document.querySelector('h1').getBoundingClientRect().left",
  )
  record('404: content uses the shared container (not flush to edge)', notFoundInset >= 16, `left=${notFoundInset}`)

  // Forms: client-side validation error state (no network needed).
  await goto('/contact')
  await evaluate(
    client,
    "document.querySelector('form button[type=\"submit\"]').click(); true",
  )
  await delay(300)
  const contactInvalid = await evaluate(
    client,
    "document.querySelectorAll('[aria-invalid=\"true\"]').length",
  )
  const contactErrorText = await evaluate(
    client,
    "Array.from(document.querySelectorAll('form p')).some((p) => /required/i.test(p.textContent))",
  )
  record('contact: empty submit shows field validation errors', contactInvalid > 0 && contactErrorText)

  await goto('/start-a-project')
  await evaluate(
    client,
    "document.querySelector('form button[type=\"submit\"]').click(); true",
  )
  await delay(300)
  const projectInvalid = await evaluate(
    client,
    "document.querySelectorAll('[aria-invalid=\"true\"]').length",
  )
  record('start-a-project: empty submit shows field validation errors', projectInvalid > 0)

  // Forms: submit failure state (dev proxy has no backend, so delivery fails).
  await goto('/contact')
  await evaluate(
    client,
    `(() => {
      const set = (el, v) => {
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
      const form = document.querySelector('form')
      set(form.querySelector('#contact-fullName'), 'Jane Doe')
      set(form.querySelector('#contact-email'), 'jane@example.com')
      set(form.querySelector('#contact-subject'), 'Hello')
      set(form.querySelector('#contact-message'), 'Please help with our process.')
      form.querySelector('button[type="submit"]').click()
      return true
    })()`,
  )
  const failureShown = await waitForPage(
    client,
    "(document.querySelector('#contact-form-error') || {}).textContent",
    { timeoutMs: 12000 },
  )
  record('contact: submission failure shows an error alert', failureShown)
} catch (error) {
  record('harness', false, error.message)
} finally {
  try {
    client?.close()
  } catch {}
  try {
    chrome?.kill()
  } catch {}
  try {
    vite?.kill()
  } catch {}
  if (userDataDir) {
    try {
      rmSync(userDataDir, { recursive: true, force: true })
    } catch {}
  }
}

const failed = results.filter((r) => !r.ok)
console.log('')
console.log(`Browser checks: ${results.length - failed.length}/${results.length} passed`)
if (failed.length) {
  console.log(`Failures: ${failed.map((f) => f.name).join('; ')}`)
  process.exit(1)
}
process.exit(0)
