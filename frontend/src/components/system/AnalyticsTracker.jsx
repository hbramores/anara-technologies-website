import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  initAnalytics,
  trackEvent,
  trackPageView,
} from '../../lib/analytics.js'

/**
 * Initializes analytics and records page views and key CTA clicks.
 * Only non-sensitive values are sent (never form field content).
 */
function AnalyticsTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
    if (pathname === '/plantwais') {
      trackEvent('plantwais_view', { page_path: pathname })
    }
  }, [pathname])

  useEffect(() => {
    function handleClick(event) {
      const link = event.target?.closest?.('a[href]')
      if (!link) return
      const href = link.getAttribute('href') || ''
      if (href === '/start-a-project') {
        trackEvent('start_a_project_click', {
          link_text: link.textContent.trim().slice(0, 60),
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}

export default AnalyticsTracker
