import { existsSync } from 'node:fs'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe')
    : null,
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean)

export function findBrowser() {
  for (const candidate of CANDIDATES) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

export async function waitForHttp(url, timeoutMs = 20000) {
  const startedAt = Date.now()
  let lastError
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await delay(200)
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError?.message}`)
}

export async function findPageTarget(cdpPort) {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/list`)
  const targets = await response.json()
  const page = targets.find((target) => target.type === 'page')
  if (!page) throw new Error('No page target available from the browser')
  return page.webSocketDebuggerUrl
}

export function connect(webSocketDebuggerUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketDebuggerUrl)
    const pending = new Map()
    const listeners = new Map()
    let nextId = 1

    const client = {
      send(method, params = {}) {
        const id = nextId++
        return new Promise((res, rej) => {
          pending.set(id, { resolve: res, reject: rej })
          socket.send(JSON.stringify({ id, method, params }))
        })
      },
      on(method, handler) {
        if (!listeners.has(method)) listeners.set(method, new Set())
        listeners.get(method).add(handler)
      },
      once(method) {
        return new Promise((res) => {
          const handler = (params) => {
            listeners.get(method)?.delete(handler)
            res(params)
          }
          client.on(method, handler)
        })
      },
      close() {
        socket.close()
      },
    }

    const timer = setTimeout(
      () => reject(new Error('Timed out connecting to the browser')),
      10000,
    )

    socket.addEventListener('open', () => {
      clearTimeout(timer)
      resolve(client)
    })
    socket.addEventListener('error', (event) => {
      clearTimeout(timer)
      reject(new Error(`Browser socket error: ${event?.message ?? 'unknown'}`))
    })
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      if (message.id && pending.has(message.id)) {
        const { resolve: res, reject: rej } = pending.get(message.id)
        pending.delete(message.id)
        if (message.error) rej(new Error(message.error.message))
        else res(message.result)
      } else if (message.method && listeners.has(message.method)) {
        for (const handler of listeners.get(message.method)) handler(message.params)
      }
    })
  })
}

export async function evaluate(client, expression, { awaitPromise = true } = {}) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise,
  })
  if (result.exceptionDetails) {
    throw new Error(
      `Page evaluation failed: ${result.exceptionDetails.text ?? 'unknown'}`,
    )
  }
  return result.result.value
}

export async function waitForPage(
  client,
  expression,
  { timeoutMs = 8000, intervalMs = 150 } = {},
) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (await evaluate(client, `Boolean(${expression})`)) return true
    await delay(intervalMs)
  }
  return false
}
