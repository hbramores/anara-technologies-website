const env = import.meta.env ?? {}
const GA_ID = env.VITE_GA_MEASUREMENT_ID

let initialized = false

/**
 * Initialize Google Analytics 4 when a measurement ID is configured.
 * No-ops (safely) when it is not, so the site works without analytics set up.
 */
export function initAnalytics() {
  if (!GA_ID || initialized || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
}

/**
 * Track an event. Only non-sensitive, non-form values should be sent.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}

export function trackPageView(path) {
  trackEvent('page_view', { page_path: path })
}

export function analyticsConfigured() {
  return Boolean(GA_ID)
}
